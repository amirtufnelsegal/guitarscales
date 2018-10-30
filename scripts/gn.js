GN={
    selectedInstrument:0,
    chordsSelect:[],
    stringTextSize:6,
    chordNumberLeftShift:2,
    fretColor:"#888",
    neckBGColor:"#bbbbbb",
    chordColor:    ["#aa0000","#00aa00","#0000aa","#aaaa00","#00aaaa","#ffaaaa","#ffaaff","#aaaaff","#666633","#3366"],
    chordColorBase:["#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff6666","#ff66ff","#6666ff","#aaaa66","#66aaaa"],            
    scaleBaseDotColor:"#dd00dd",
    scaleDotColor:"#880088",
    scaleDotRadius:1.25,
    dotdR:0.55,
    strokeWidth:"0.25%",
    scaleSelect:0,            
    scaleSelectBase:-1,
    selectedString:-1,
    oscCount:8,
    frequencies:[261.63,277.18,293.66,311.13,329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88],
    scaleNoteLength:500,
    chordNoteLength:1000,
    chordNoteDelay:100,
    scaleNoteGain:0.2,
    noteRampSeconds:0.1,
    instrumentTunings:[
        [4,9,2,7,11,4],            
        [11,4,9,2,7,11,4],                    
        [4,9,2,7],
        [11,4,9,2,7],        
        [7,2,7,11,2],
        [7,0,4,9]
    ],
    isPlaying:false,
    stringTunings:[4,9,2,7,11,4],            
    scales:[
        [0,2,4,7,9],
        [0,3,5,7,10],
        [0,2,4,5,7,9,11],
        [0,2,3,5,7,9,10],
        [0,1,3,5,7,8,10],
        [0,2,4,6,7,9,11],
        [0,2,4,5,7,9,10],
        [0,2,3,5,7,8,10],
        [0,2,3,5,7,8,11],                
        [0,1,3,5,6,8,10]
    ],
    chords:[{
        name:'min',
        notes:[0,3,7]
    },{
        name:'',
        notes:[0,4,7]
    },{
        name:'<sup><span class="strikethrough">o</span></sup>',
        notes:[0,3,6,10]
    },{
        name:'<sup>o</sup>',
        notes:[0,3,6,9]
    },{
        name:'+',
        notes:[0,4,8]
    }],
    additions:[{
        name:'9',
        value:2,
        octaveAdd:1
    },{
        name:'7',
        value:10,
        octaveAdd:0
    },{name:'7+',
        value:11,
        octaveAdd:0
    },{name:'6',
        value:9,
        octaveAdd:0
    },{name:'5+',
        value:8,
        octaveAdd:0
    },{name:'5-',
        value:6,
        octaveAdd:0
    },{name:'4',
        value:5,
        octaveAdd:0
        
    }
    ],
    svgHeight:300,
    barShift:20,
    stringCount:6,
    stringHeights:[],
    barLocations:[1],
    noteArray:[
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B"
    ],
    audioCtx:new (window.AudioContext || window.webkitAudioContext)(),
    oscillators:[],
    oscTimeHandles:[0,0,0,0,0,0,0,0],
    initSound:function(){
        GN.oscillators=[];
        for(var i=0;i<GN.oscCount;i++){
            var tempOsc=GN.audioCtx.createOscillator();
            var gainNode = GN.audioCtx.createGain();
            gainNode.connect(GN.audioCtx.destination);
            gainNode.gain.setValueAtTime(0,0); //out of 1
            tempOsc.connect(gainNode);
            tempOsc.type='sine';
            tempOsc.frequency=440;
            tempOsc.start();
            GN.oscillators.push({
                oscillator:tempOsc,
                gain:gainNode
            });
        }                
    },
    playNote:function(oscIndex,freq,time){
        GN.oscillators[oscIndex].oscillator.frequency.value=freq;
        //GN.oscillators[oscIndex].gain.gain.value=GN.scaleNoteGain;
        GN.oscillators[oscIndex].gain.gain.linearRampToValueAtTime(GN.scaleNoteGain,GN.audioCtx.currentTime+GN.noteRampSeconds);
        
        (function(oscIndex){
                    GN.oscTimeHandles[oscIndex]=setTimeout(function(){
                        //GN.oscillators[oscIndex].gain.gain.value=0;
                        GN.oscillators[oscIndex].gain.gain.linearRampToValueAtTime(0,GN.audioCtx.currentTime+GN.noteRampSeconds);                                
                    },time);
                })(oscIndex);

    },
    playScale:function(){
        if(GN.isPlaying==false){//if not already playing
            GN.isPlaying=true;               
            noteLength=GN.scaleNoteLength;
            if(GN.scaleSelectBase>-1){//if base note selected
                var scaleNotes=[];
                //for each note
                for(var i=0;i<=GN.scales[GN.scaleSelect].length;i++){
                    if(i<GN.scales[GN.scaleSelect].length){
                        scaleNotes.push((GN.scales[GN.scaleSelect][i]+GN.scaleSelectBase)%12);
                    }else{//add first note again
                        scaleNotes.push((GN.scales[GN.scaleSelect][0]+GN.scaleSelectBase)%12);                            
                    }
                    (function(index){
                        GN.oscTimeHandles[index]=setTimeout(function(){
                        if(index==0 || scaleNotes[index]>scaleNotes[0]){
                            var freq=GN.frequencies[scaleNotes[index]];
                        }else{//increase octave
                            var freq=GN.frequencies[scaleNotes[index]]*2;
                        }

                        GN.playNote(index,freq,noteLength);
                        },i*noteLength);
                    })(i);
                };
                setTimeout(function(){
                        GN.isPlaying=false;
                        },(GN.scales[GN.scaleSelect].length+1)*noteLength);                        
            }
        }
    },
    playChord:function(note,chordIndex){
        if(GN.isPlaying==false){//if not already playing
            GN.isPlaying=true;               
            noteLength=GN.chordNoteLength;
            var chordNotes=[];
            //chord notes
            for(var i=0;i<GN.chords[chordIndex].notes.length;i++){
                chordNotes.push((note+GN.chords[chordIndex].notes[i])%12);
            }
            //if additions were selected
            var additions=[];
            for(var i=0;i<GN.chordsSelect.length;i++){
                if(GN.chordsSelect[i].note==note && GN.chordsSelect[i].chord==chordIndex){
                    for(var j=0;j<GN.chordsSelect[i].additions.length;j++){
                        additions.push({
                            note:(note+GN.additions[GN.chordsSelect[i].additions[j]].value)%12,
                            octaveAdd:GN.additions[GN.chordsSelect[i].additions[j]].octaveAdd
                        });
                    }
                    break;
                }
            }
            //for each note in chord
            for(var i=0;i<chordNotes.length;i++){
                (function(index){
                    GN.oscTimeHandles[index]=setTimeout(function(){
                    if(index==0 || chordNotes[index]>chordNotes[0]){
                        var freq=GN.frequencies[chordNotes[index]];
                    }else{//increase octave
                        var freq=GN.frequencies[chordNotes[index]]*2;
                    }

                    GN.playNote(index,freq,noteLength);
                    },i*GN.chordNoteDelay);
                })(i);
            };
            //for each addition note
            for(var i=0;i<additions.length;i++){
                (function(index){
                    GN.oscTimeHandles[chordNotes.length+index]=setTimeout(function(){
                    if(additions[index].note>chordNotes[0]){
                        var freq=GN.frequencies[additions[index].note];
                    }else{//increase octave
                        var freq=GN.frequencies[additions[index].note]*2;
                    }
                    if(additions[index].octaveAdd>0){
                        freq*=Math.pow(2,additions[index].octaveAdd);
                    }
                    GN.playNote(chordNotes.length+index,freq,noteLength);
                    },(chordNotes.length+i)*GN.chordNoteDelay);
                })(i);
            };                    
            setTimeout(function(){
                    GN.isPlaying=false;
                    },(chordNotes.length+additions.length)*GN.chordNoteDelay+GN.chordNoteLength);
        }
    },
    changeInstrument:function(){
        var newInstrumentIndex=document.getElementById("instrumentSelect").value;
        if(newInstrumentIndex!=GN.selectedInstrument){
            GN.selectedInstrument=newInstrumentIndex;
            GN.stringTunings=GN.instrumentTunings[document.getElementById("instrumentSelect").value];
            GN.changeScale();
        }
    },
    changeScale:function(){
        GN.scaleSelectBase=Number(document.getElementById("scaleSelectBase").value);
        GN.scaleSelect=Number(document.getElementById("scaleSelect").value);
        GN.chordsSelect=[];
        GN.drawNeck();           
        GN.showScaleChords();     
    },
    noteName:function(x){
        return GN.noteArray[x];
    },
    clearNeck:function(){
        var parent = document.getElementById("guitarNeck");
        for(var i=parent.children.length;i>0;i--){
            parent.removeChild(parent.children[i-1]);
        }
    },
    changeStringTuning:function(){
        var i=GN.selectedString;
        var s=Number(document.getElementById('noteSelect').value);
        GN.stringTunings[i]=s;
        myElement=document.getElementById("noteSelect");
        myElement.style.display="none";
        GN.drawNeck();
        GN.selectedString=-1;
    },
    drawDot:function(string,bar,fillColor,radius,strokeColor){
        var svg = document.getElementById('guitarNeck'); //Get svg element
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
        var x=0;
        if(bar>0){
            x=(GN.barLocations[bar]+GN.barLocations[bar-1])/2;
        }
        newElement.setAttribute("cx",(GN.barShift+x)); //Set circle center center x
        newElement.setAttribute("cy",GN.stringHeights[string]); //Set circle center center y
        newElement.setAttribute("r",radius); //Set circle radius                
        if (fillColor!='')
            newElement.setAttribute("fill",fillColor); //Set circle color
        if (strokeColor!=''){
            newElement.setAttribute("stroke",strokeColor); //Set stroke color
            newElement.setAttribute("stroke-width",GN.strokeWidth); //Set stroke color
        }


        svg.appendChild(newElement);                  
    },
    drawNeck:function(){
        GN.clearNeck();
        var x0=13;
        var x=x0;
        GN.barLocations=[1];                
        for(var i=1;i<25;i++){
            GN.barLocations.push(x);
            x=x+x0-i*0.41;
        }

        GN.stringHeights=[];
        var stringCount=GN.stringTunings.length
        for(var i=0;i<stringCount;i++){
            GN.stringHeights.push((i+1)*100/(stringCount+1));
        }
        
        var svg = document.getElementById('guitarNeck'); //Get svg element

        //background
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        newElement.setAttribute("width",220); //Set path's data
        newElement.setAttribute("height",100); //Set path's data
        newElement.style.fill = GN.neckBGColor; //Set stroke colour
        svg.appendChild(newElement); 
        
        //bars
        for(var i=0;i<GN.barLocations.length;i++){
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            newElement.setAttribute("d","M "+(GN.barShift+GN.barLocations[i])+" 0 L "+(GN.barShift+GN.barLocations[i])+" 100"); //Set path's data
            newElement.style.stroke = GN.fretColor; //Set stroke colour
            newElement.style.strokeWidth = "0.5px"; //Set stroke width
            svg.appendChild(newElement);  

            //bar number
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
            if (i==0)
                newElement.setAttribute("x",GN.barShift+GN.barLocations[0]-GN.chordNumberLeftShift); //Set  x
            else
                newElement.setAttribute("x",GN.barShift+(GN.barLocations[i]+GN.barLocations[i-1])/2-GN.chordNumberLeftShift); //Set  x                    

            newElement.setAttribute("y",95);
            newElement.setAttribute("font-size",4); //Set font font-size
            var textNode = document.createTextNode(i);
            newElement.appendChild(textNode);
            svg.appendChild(newElement);                      
        }

      //strings
      for(var i=0;i<GN.stringTunings.length;i++){
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
            newElement.setAttribute("d","M 20 "+GN.stringHeights[i]+" L 220 "+GN.stringHeights[i]); //Set path's data
            newElement.style.stroke = "#000000"; //Set stroke colour
            newElement.style.strokeWidth = "0.5px"; //Set stroke width
            svg.appendChild(newElement);  

            //string text
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
            newElement.setAttribute("x",5); //Set x
            newElement.setAttribute("y",GN.stringHeights[i]); //Set y
            newElement.setAttribute("font-size",GN.stringTextSize); //Set font font-size
            newElement.setAttribute("id","stringTuning"+i); //Set font font-size
            newElement.onclick = function (e) {
                        var i=Number(e.target.id[e.target.id.length-1]);
                        document.getElementById('noteSelect').value=GN.stringTunings[i];
                        GN.selectedString=i;
                        myElement=document.getElementById("noteSelect");
                        myElement.style.display="block";
                        myElement.style.left="10px";
                        myElement.style.top=(GN.stringHeights[i]*GN.svgHeight/100-5)+"px";
                        var parent = document.getElementById("guitarNeck");
                        var child = document.getElementById("stringTuning"+i);
                        parent.removeChild(child);
                };        
            var textNode = document.createTextNode(GN.noteName(GN.stringTunings[i]));
            newElement.appendChild(textNode);
            svg.appendChild(newElement);              
        }

        GN.showScale();
        GN.drawSelectedChords();
    },
    drawSelectedChords:function(){
        var svg = document.getElementById('guitarNeck'); //Get svg element                
        for(var i=0;i<GN.chordsSelect.length;i++){
            //for each chord set notes
            var chordNotes=[];
            for(var j=0;j<GN.chords[GN.chordsSelect[i].chord].notes.length;j++){
                chordNotes[j]=(GN.chords[GN.chordsSelect[i].chord].notes[j]+GN.chordsSelect[i].note)%12;
            }
            for(var j=0;j<GN.chordsSelect[i].additions.length;j++){
                chordNotes.push((GN.additions[GN.chordsSelect[i].additions[j]].value+GN.chordsSelect[i].note)%12);
            }

            //for each string
            for(var j=0;j<GN.stringHeights.length;j++){
                //for each bar
                for(var k=0;k<GN.barLocations.length;k++){
                    var theNote=(GN.stringTunings[j]+k)%12;
                    //for each chor note
                    for(l=0;l<chordNotes.length;l++){
                        if (chordNotes[l]==theNote){
                            //draw circle
                            if(l==0){
                                GN.drawDot(j,k,'none',GN.chordsSelect[i].radius,GN.chordColorBase[GN.chordsSelect[i].colorCode]);
                            }else{
                                GN.drawDot(j,k,'none',GN.chordsSelect[i].radius,GN.chordColor[GN.chordsSelect[i].colorCode]);                                        
                            }                                  
                        }
                    }
                }
            }
        }
    },
    showScale:function(){
        var svg = document.getElementById('guitarNeck'); //Get svg element
        if(GN.scaleSelectBase>-1)
        {
            //for each string
            for(var i=0;i<GN.stringTunings.length;i++){
                var stringTune=GN.stringTunings[i];
                //for each bar
                for(var j=0;j<GN.barLocations.length;j++){
                    var barNote=(stringTune+j)%12;
                    //for each scale note
                    for(var k=0;k<GN.scales[GN.scaleSelect].length;k++){
                        var scaleNote=(GN.scales[GN.scaleSelect][k]+GN.scaleSelectBase)%12;
                        if (scaleNote==barNote)
                        {
                            if(GN.scaleSelectBase==scaleNote){
                                //newElement.setAttribute("fill",GN.scaleBaseDotColor); //Set circle color
                                GN.drawDot(i,j,GN.scaleBaseDotColor,GN.scaleDotRadius,'');                                        
                            }else{
                                //newElement.setAttribute("fill",GN.scaleDotColor); //Set circle color
                                GN.drawDot(i,j,GN.scaleDotColor,GN.scaleDotRadius,'');                                        
                            }
                        }
                    }
                }
            }
        }
    },
    sortNotes:function(a,b){
        a=Number(a.note);
        b=Number(b.note);
        a=a-GN.scaleSelectBase;
        if(a<0)
            a+=12;
        b=b-GN.scaleSelectBase;
        if(b<0)
            b+=12;
        return a-b;
    },
    fixNoteName:function(noteA,b){
        //noteA is previous note text
        //b is note integer
        //note B follows note A, correct note B name
        if(noteA=='')
            return GN.noteArray[b];
        else{
            var noteB=GN.noteArray[b]; 
            var c=(b+1)%12;
            var noteC=GN.noteArray[c]+'b';
            if (noteA!=noteB && noteA!=noteC && noteA.charAt(0)==noteB.charAt(0)){
                var c=(b+1)%12;
                return GN.noteArray[c]+'b';
            }else{
                if(noteA==noteC){
                    return noteC;
                }
                else
                    return noteB;
            }
        }
    },
    showScaleChords:function(){
        var div=document.getElementById('scaleChordsDiv');
        if (GN.scaleSelectBase==-1){
            div.innerHTML='';
        }else{
            var chordsText='';
            var chordsArray=[];
            var selectedScale=GN.scales[GN.scaleSelect];
            //for every chord
            for(var i=0;i<GN.chords.length;i++) {
                var chordNotes=GN.chords[i].notes;
                //scan scale 
                for(var j=0;j<selectedScale.length;j++){
                    var dif0=(chordNotes[0]-selectedScale[j])%12;
                    if(dif0<0)
                        dif0+=12;
                    //check if rest of the scale notes have the same dif
                    var countGoodNotes=1;
                    for(var k=1;k<chordNotes.length;k++){
                        for(var l=0;l<selectedScale.length;l++){
                            if(l!=j){
                                var tempDif=(chordNotes[k]-selectedScale[l])%12;
                                if(tempDif<0)
                                    tempDif+=12;
                                if(tempDif==dif0){
                                    countGoodNotes+=1;
                                }
                            }
                        }
                    }
                    //if found a chord
                    if (countGoodNotes==chordNotes.length){
                        dif0=(GN.scaleSelectBase-dif0)%12;
                        if(dif0<0){
                            dif0+=12;
                        }
                        var additions=[];
                        var additionsText='(';
                        //scan possible additions
                        for (var k=0;k<GN.additions.length;k++)
                            {
                                var additionNote=GN.additions[k].value;
                                var exists=false;
                                //check if addition exists in scale
                                for(var l=0;l<GN.scales[GN.scaleSelect].length;l++){
                                    var a=(GN.scaleSelectBase+GN.scales[GN.scaleSelect][l])%12;
                                    var b=(dif0+additionNote)%12;
                                    if(a==b)
                                        {
                                            exists=true;
                                            break;
                                        }
                                }
                                if (exists==true){
                                    //check that addition does NOT exist already in chord
                                    exists=false;
                                    for(var l=0;l<GN.chords[i].notes.length;l++){
                                        var a=GN.chords[i].notes[l];
                                        var b=additionNote;
                                        if(a==b)
                                            {
                                                exists=true;
                                                break;
                                            }
                                    }
                                    if(exists==false)             
                                    {
                                    additions.push(k);
                                    additionsText+='<span id="GNaddN'+dif0+'C'+i+'A'+k+'" onclick="GN.clickOption(this,'+dif0+','+i+','+k+');" class="GNpointer">'+GN.additions[k].name+'</span> ,';
                                    }
                                }
                            }
                        if(additionsText.length>1){
                            additionsText=additionsText.substr(0,additionsText.length-1);
                            additionsText+=') <button onclick="GN.playChord('+dif0+','+i+');">Play</button></span><BR>';
                        }else{
                            additionsText=' <button onclick="GN.playChord('+dif0+','+i+');">Play</button></span><BR>';
                        }
                        chordsArray.push({
                            note:dif0,
                            nameText:GN.chords[i].name,
                            noteText:'',
                            additions:additions,
                            additionsText:additionsText,
                            chordIndex:i
                        });
                    }
                }
            }
            chordsArray.sort(GN.sortNotes);
            for(var i=0;i<chordsArray.length;i++){
                if (i==0)
                    var noteName=GN.noteArray[chordsArray[i].note];
                else
                    var noteName=GN.fixNoteName(chordsArray[i-1].noteText,chordsArray[i].note);
                    //var noteName=GN.noteArray[chordsArray[i].note];
                chordsArray[i].noteText=noteName;
                chordsText+='<span id="GNN'+chordsArray[i].note+'C'+chordsArray[i].chordIndex+'" ><span id="GNCN'+chordsArray[i].note+'C'+chordsArray[i].chordIndex+'" onclick="GN.clickChord(this,'+chordsArray[i].note+','+chordsArray[i].chordIndex+');" class="GNpointer">'+noteName+chordsArray[i].nameText+'</span> '+chordsArray[i].additionsText+'<BR>';
                }
            div.innerHTML=chordsText;
        }
    },
    clickChord:function(obj,note,chordIndex){
        if(obj.style.fontWeight=='' || obj.style.fontWeight=='normal')
        {
            //chord selected
            
            //select chord dot raduis
            var newRadius=GN.scaleDotRadius+GN.dotdR;
            var isFound=false;
            while(isFound==false){
                //check if the color is selected
                for(var j=0;j<GN.chordsSelect.length;j++){
                    if(GN.chordsSelect[j].radius==newRadius){
                        newRadius+=GN.dotdR;
                        isFound=true;
                        break;
                    }
                }
                if(isFound==true)
                    isFound=false;
                else
                    isFound=true; 
            }                    

            //select chord color
            //for each chord color
            var newChordColorCode=0;
            for(var i=0;i<GN.chordColor.length;i++){
                //check if the color is selected
                var isFound=false;
                for(var j=0;j<GN.chordsSelect.length;j++){
                    if(GN.chordsSelect[j].colorCode==i){
                        isFound=true;
                        break;
                    }
                }
                if(isFound==false){
                    newChordColorCode=i;
                    break;
                }
            }
            obj.style.fontWeight='bold';
            GN.chordsSelect.push({
                note:note,
                chord:chordIndex,
                additions:[],
                colorCode:newChordColorCode,
                radius:newRadius
            });
            obj.parentNode.style.color=GN.chordColorBase[newChordColorCode];
        }
        else
        {
            //chord unselected
            obj.style.fontWeight='normal';     
            obj.parentNode.style.color='#000000';                               
            for(var i=0;i<GN.chordsSelect.length;i++){
                var tempChord=GN.chordsSelect[i];
                if(tempChord.note==note && tempChord.chord==chordIndex){
                    for(var j=0;j<GN.chordsSelect[i].additions.length;j++){
                        var additionText=document.getElementById('GNaddN'+GN.chordsSelect[i].note+'C'+GN.chordsSelect[i].chord+'A'+GN.chordsSelect[i].additions[j]);
                        additionText.style.fontWeight='normal'; 
                    }
                    GN.chordsSelect.splice(i,1);
                    break;
                }
            }
        }
        GN.drawNeck();                
    },
    clickOption:function(obj,note,chordIndex,additionIndex){
        //GN.additions[additionIndex]
        if(obj.style.fontWeight=='' || obj.style.fontWeight=='normal'){
            //if chord is selected ...(otherwise do nothing)
            var isFound=-1;
            for(var i=0;i<GN.chordsSelect.length;i++){
                if(GN.chordsSelect[i].note==note && GN.chordsSelect[i].chord==chordIndex){
                    isFound=i;
                    break;
                }
            }
            if(isFound==-1){//if chord not selected, select it
                var objChord=document.getElementById('GNCN'+note+'C'+chordIndex);
                GN.clickChord(objChord,note,chordIndex);
                isFound=GN.chordsSelect.length-1;
            }
            //if(isFound>-1){
            obj.style.fontWeight='bold';
            GN.chordsSelect[isFound].additions.push(additionIndex);
            GN.drawNeck();                                        
            //}
        }else{
            obj.style.fontWeight='normal';
            for(var i=0;i<GN.chordsSelect.length;i++){
                if(GN.chordsSelect[i].note==note){
                    if(GN.chordsSelect[i].chord==chordIndex){
                        GN.chordsSelect[i].additions.splice(GN.chordsSelect[i].additions.indexOf(additionIndex),1);
                        break;
                    }
                }
            }
            GN.drawNeck();                                                            
        }
    },
    flipStrings:function(){
        var stringCount=GN.stringTunings.length;
        for(var i=0;i<Math.floor(stringCount/2);i++){
            var a=GN.stringTunings[stringCount-1-i];
            GN.stringTunings[stringCount-1-i]=GN.stringTunings[i];
            GN.stringTunings[i]=a;
        }
        GN.drawNeck();              
    }
}
function gnInit(){
    GN.drawNeck();
    GN.initSound();         
    var GNcontainer=document.getElementById("guitarNeckAppContainer");
    GNcontainer.style.background=GN.neckBGColor;
}