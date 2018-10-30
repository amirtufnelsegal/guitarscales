function gnInit(){GN.drawNeck(),GN.initSound(),document.getElementById("guitarNeckAppContainer").style.background=GN.neckBGColor}GN={selectedInstrument:0,chordsSelect:[],stringTextSize:6,chordNumberLeftShift:2,fretColor:"#888",neckBGColor:"#bbbbbb",chordColor:["#aa0000","#00aa00","#0000aa","#aaaa00","#00aaaa","#ffaaaa","#ffaaff","#aaaaff","#666633","#3366"],chordColorBase:["#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff6666","#ff66ff","#6666ff","#aaaa66","#66aaaa"],scaleBaseDotColor:"#dd00dd",scaleDotColor:"#880088",scaleDotRadius:1.25,dotdR:.55,strokeWidth:"0.25%",scaleSelect:0,scaleSelectBase:-1,selectedString:-1,oscCount:8,frequencies:[261.63,277.18,293.66,311.13,329.63,349.23,369.99,392,415.3,440,466.16,493.88],scaleNoteLength:500,chordNoteLength:1e3,chordNoteDelay:100,scaleNoteGain:.2,noteRampSeconds:.1,instrumentTunings:[[4,9,2,7,11,4],[11,4,9,2,7,11,4],[4,9,2,7],[11,4,9,2,7],[7,2,7,11,2],[7,0,4,9]],isPlaying:!1,stringTunings:[4,9,2,7,11,4],scales:[[0,2,4,7,9],[0,3,5,7,10],[0,2,4,5,7,9,11],[0,2,3,5,7,9,10],[0,1,3,5,7,8,10],[0,2,4,6,7,9,11],[0,2,4,5,7,9,10],[0,2,3,5,7,8,10],[0,2,3,5,7,8,11],[0,1,3,5,6,8,10]],chords:[{name:"min",notes:[0,3,7]},{name:"",notes:[0,4,7]},{name:'<sup><span class="strikethrough">o</span></sup>',notes:[0,3,6,10]},{name:"<sup>o</sup>",notes:[0,3,6,9]},{name:"+",notes:[0,4,8]}],additions:[{name:"9",value:2,octaveAdd:1},{name:"7",value:10,octaveAdd:0},{name:"7+",value:11,octaveAdd:0},{name:"6",value:9,octaveAdd:0},{name:"5+",value:8,octaveAdd:0},{name:"5-",value:6,octaveAdd:0},{name:"4",value:5,octaveAdd:0}],svgHeight:300,barShift:20,stringCount:6,stringHeights:[],barLocations:[1],noteArray:["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],audioCtx:new(window.AudioContext||window.webkitAudioContext),oscillators:[],oscTimeHandles:[0,0,0,0,0,0,0,0],initSound:function(){GN.oscillators=[];for(var e=0;e<GN.oscCount;e++){var t=GN.audioCtx.createOscillator(),n=GN.audioCtx.createGain();n.connect(GN.audioCtx.destination),n.gain.setValueAtTime(0,0),t.connect(n),t.type="sine",t.frequency=440,t.start(),GN.oscillators.push({oscillator:t,gain:n})}},playNote:function(e,t,n){var o;GN.oscillators[e].oscillator.frequency.value=t,GN.oscillators[e].gain.gain.linearRampToValueAtTime(GN.scaleNoteGain,GN.audioCtx.currentTime+GN.noteRampSeconds),o=e,GN.oscTimeHandles[o]=setTimeout(function(){GN.oscillators[o].gain.gain.linearRampToValueAtTime(0,GN.audioCtx.currentTime+GN.noteRampSeconds)},n)},playScale:function(){if(0==GN.isPlaying&&(GN.isPlaying=!0,noteLength=GN.scaleNoteLength,GN.scaleSelectBase>-1)){for(var e=[],t=0;t<=GN.scales[GN.scaleSelect].length;t++)t<GN.scales[GN.scaleSelect].length?e.push((GN.scales[GN.scaleSelect][t]+GN.scaleSelectBase)%12):e.push((GN.scales[GN.scaleSelect][0]+GN.scaleSelectBase)%12),function(n){GN.oscTimeHandles[n]=setTimeout(function(){if(0==n||e[n]>e[0])var t=GN.frequencies[e[n]];else t=2*GN.frequencies[e[n]];GN.playNote(n,t,noteLength)},t*noteLength)}(t);setTimeout(function(){GN.isPlaying=!1},(GN.scales[GN.scaleSelect].length+1)*noteLength)}},playChord:function(e,t){if(0==GN.isPlaying){GN.isPlaying=!0,noteLength=GN.chordNoteLength;for(var n=[],o=0;o<GN.chords[t].notes.length;o++)n.push((e+GN.chords[t].notes[o])%12);var r=[];for(o=0;o<GN.chordsSelect.length;o++)if(GN.chordsSelect[o].note==e&&GN.chordsSelect[o].chord==t){for(var s=0;s<GN.chordsSelect[o].additions.length;s++)r.push({note:(e+GN.additions[GN.chordsSelect[o].additions[s]].value)%12,octaveAdd:GN.additions[GN.chordsSelect[o].additions[s]].octaveAdd});break}for(o=0;o<n.length;o++)!function(e){GN.oscTimeHandles[e]=setTimeout(function(){if(0==e||n[e]>n[0])var t=GN.frequencies[n[e]];else t=2*GN.frequencies[n[e]];GN.playNote(e,t,noteLength)},o*GN.chordNoteDelay)}(o);for(o=0;o<r.length;o++)!function(e){GN.oscTimeHandles[n.length+e]=setTimeout(function(){if(r[e].note>n[0])var t=GN.frequencies[r[e].note];else t=2*GN.frequencies[r[e].note];r[e].octaveAdd>0&&(t*=Math.pow(2,r[e].octaveAdd)),GN.playNote(n.length+e,t,noteLength)},(n.length+o)*GN.chordNoteDelay)}(o);setTimeout(function(){GN.isPlaying=!1},(n.length+r.length)*GN.chordNoteDelay+GN.chordNoteLength)}},changeInstrument:function(){var e=document.getElementById("instrumentSelect").value;e!=GN.selectedInstrument&&(GN.selectedInstrument=e,GN.stringTunings=GN.instrumentTunings[document.getElementById("instrumentSelect").value],GN.changeScale())},changeScale:function(){GN.scaleSelectBase=Number(document.getElementById("scaleSelectBase").value),GN.scaleSelect=Number(document.getElementById("scaleSelect").value),GN.chordsSelect=[],GN.drawNeck(),GN.showScaleChords()},noteName:function(e){return GN.noteArray[e]},clearNeck:function(){for(var e=document.getElementById("guitarNeck"),t=e.children.length;t>0;t--)e.removeChild(e.children[t-1])},changeStringTuning:function(){var e=GN.selectedString,t=Number(document.getElementById("noteSelect").value);GN.stringTunings[e]=t,myElement=document.getElementById("noteSelect"),myElement.style.display="none",GN.drawNeck(),GN.selectedString=-1},drawDot:function(e,t,n,o,r){var s=document.getElementById("guitarNeck"),a=document.createElementNS("http://www.w3.org/2000/svg","circle"),c=0;t>0&&(c=(GN.barLocations[t]+GN.barLocations[t-1])/2),a.setAttribute("cx",GN.barShift+c),a.setAttribute("cy",GN.stringHeights[e]),a.setAttribute("r",o),""!=n&&a.setAttribute("fill",n),""!=r&&(a.setAttribute("stroke",r),a.setAttribute("stroke-width",GN.strokeWidth)),s.appendChild(a)},drawNeck:function(){GN.clearNeck();var e=13;GN.barLocations=[1];for(var t=1;t<25;t++)GN.barLocations.push(e),e=e+13-.41*t;GN.stringHeights=[];var n=GN.stringTunings.length;for(t=0;t<n;t++)GN.stringHeights.push(100*(t+1)/(n+1));var o=document.getElementById("guitarNeck");(r=document.createElementNS("http://www.w3.org/2000/svg","rect")).setAttribute("width",220),r.setAttribute("height",100),r.style.fill=GN.neckBGColor,o.appendChild(r);for(t=0;t<GN.barLocations.length;t++){(r=document.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d","M "+(GN.barShift+GN.barLocations[t])+" 0 L "+(GN.barShift+GN.barLocations[t])+" 100"),r.style.stroke=GN.fretColor,r.style.strokeWidth="0.5px",o.appendChild(r);var r=document.createElementNS("http://www.w3.org/2000/svg","text");0==t?r.setAttribute("x",GN.barShift+GN.barLocations[0]-GN.chordNumberLeftShift):r.setAttribute("x",GN.barShift+(GN.barLocations[t]+GN.barLocations[t-1])/2-GN.chordNumberLeftShift),r.setAttribute("y",95),r.setAttribute("font-size",4);var s=document.createTextNode(t);r.appendChild(s),o.appendChild(r)}for(t=0;t<GN.stringTunings.length;t++){(r=document.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d","M 20 "+GN.stringHeights[t]+" L 220 "+GN.stringHeights[t]),r.style.stroke="#000000",r.style.strokeWidth="0.5px",o.appendChild(r),(r=document.createElementNS("http://www.w3.org/2000/svg","text")).setAttribute("x",5),r.setAttribute("y",GN.stringHeights[t]),r.setAttribute("font-size",GN.stringTextSize),r.setAttribute("id","stringTuning"+t),r.onclick=function(e){var t=Number(e.target.id[e.target.id.length-1]);document.getElementById("noteSelect").value=GN.stringTunings[t],GN.selectedString=t,myElement=document.getElementById("noteSelect"),myElement.style.display="block",myElement.style.left="10px",myElement.style.top=GN.stringHeights[t]*GN.svgHeight/100-5+"px";var n=document.getElementById("guitarNeck"),o=document.getElementById("stringTuning"+t);n.removeChild(o)};s=document.createTextNode(GN.noteName(GN.stringTunings[t]));r.appendChild(s),o.appendChild(r)}GN.showScale(),GN.drawSelectedChords()},drawSelectedChords:function(){document.getElementById("guitarNeck");for(var e=0;e<GN.chordsSelect.length;e++){for(var t=[],n=0;n<GN.chords[GN.chordsSelect[e].chord].notes.length;n++)t[n]=(GN.chords[GN.chordsSelect[e].chord].notes[n]+GN.chordsSelect[e].note)%12;for(n=0;n<GN.chordsSelect[e].additions.length;n++)t.push((GN.additions[GN.chordsSelect[e].additions[n]].value+GN.chordsSelect[e].note)%12);for(n=0;n<GN.stringHeights.length;n++)for(var o=0;o<GN.barLocations.length;o++){var r=(GN.stringTunings[n]+o)%12;for(l=0;l<t.length;l++)t[l]==r&&(0==l?GN.drawDot(n,o,"none",GN.chordsSelect[e].radius,GN.chordColorBase[GN.chordsSelect[e].colorCode]):GN.drawDot(n,o,"none",GN.chordsSelect[e].radius,GN.chordColor[GN.chordsSelect[e].colorCode]))}}},showScale:function(){document.getElementById("guitarNeck");if(GN.scaleSelectBase>-1)for(var e=0;e<GN.stringTunings.length;e++)for(var t=GN.stringTunings[e],n=0;n<GN.barLocations.length;n++)for(var o=(t+n)%12,r=0;r<GN.scales[GN.scaleSelect].length;r++){var s=(GN.scales[GN.scaleSelect][r]+GN.scaleSelectBase)%12;s==o&&(GN.scaleSelectBase==s?GN.drawDot(e,n,GN.scaleBaseDotColor,GN.scaleDotRadius,""):GN.drawDot(e,n,GN.scaleDotColor,GN.scaleDotRadius,""))}},sortNotes:function(e,t){return e=Number(e.note),t=Number(t.note),(e-=GN.scaleSelectBase)<0&&(e+=12),(t-=GN.scaleSelectBase)<0&&(t+=12),e-t},fixNoteName:function(e,t){if(""==e)return GN.noteArray[t];var n=GN.noteArray[t],o=(t+1)%12,r=GN.noteArray[o]+"b";if(e!=n&&e!=r&&e.charAt(0)==n.charAt(0)){o=(t+1)%12;return GN.noteArray[o]+"b"}return e==r?r:n},showScaleChords:function(){var e=document.getElementById("scaleChordsDiv");if(-1==GN.scaleSelectBase)e.innerHTML="";else{for(var t="",n=[],o=GN.scales[GN.scaleSelect],r=0;r<GN.chords.length;r++)for(var s=GN.chords[r].notes,a=0;a<o.length;a++){var c=(s[0]-o[a])%12;c<0&&(c+=12);for(var l=1,i=1;i<s.length;i++)for(var d=0;d<o.length;d++)if(d!=a){var N=(s[i]-o[d])%12;N<0&&(N+=12),N==c&&(l+=1)}if(l==s.length){(c=(GN.scaleSelectBase-c)%12)<0&&(c+=12);var G=[],h="(";for(i=0;i<GN.additions.length;i++){var u=GN.additions[i].value,g=!1;for(d=0;d<GN.scales[GN.scaleSelect].length;d++){if((GN.scaleSelectBase+GN.scales[GN.scaleSelect][d])%12==(c+u)%12){g=!0;break}}if(1==g){g=!1;for(d=0;d<GN.chords[r].notes.length;d++){if(GN.chords[r].notes[d]==u){g=!0;break}}0==g&&(G.push(i),h+='<span id="GNaddN'+c+"C"+r+"A"+i+'" onclick="GN.clickOption(this,'+c+","+r+","+i+');" class="GNpointer">'+GN.additions[i].name+"</span> ,")}}h.length>1?(h=h.substr(0,h.length-1),h+=') <button onclick="GN.playChord('+c+","+r+');">Play</button></span><BR>'):h=' <button onclick="GN.playChord('+c+","+r+');">Play</button></span><BR>',n.push({note:c,nameText:GN.chords[r].name,noteText:"",additions:G,additionsText:h,chordIndex:r})}}n.sort(GN.sortNotes);for(r=0;r<n.length;r++){if(0==r)var f=GN.noteArray[n[r].note];else f=GN.fixNoteName(n[r-1].noteText,n[r].note);n[r].noteText=f,t+='<span id="GNN'+n[r].note+"C"+n[r].chordIndex+'" ><span id="GNCN'+n[r].note+"C"+n[r].chordIndex+'" onclick="GN.clickChord(this,'+n[r].note+","+n[r].chordIndex+');" class="GNpointer">'+f+n[r].nameText+"</span> "+n[r].additionsText+"<BR>"}e.innerHTML=t}},clickChord:function(e,t,n){if(""==e.style.fontWeight||"normal"==e.style.fontWeight){for(var o=GN.scaleDotRadius+GN.dotdR,r=!1;0==r;){for(var s=0;s<GN.chordsSelect.length;s++)if(GN.chordsSelect[s].radius==o){o+=GN.dotdR,r=!0;break}r=1!=r}for(var a=0,c=0;c<GN.chordColor.length;c++){for(r=!1,s=0;s<GN.chordsSelect.length;s++)if(GN.chordsSelect[s].colorCode==c){r=!0;break}if(0==r){a=c;break}}e.style.fontWeight="bold",GN.chordsSelect.push({note:t,chord:n,additions:[],colorCode:a,radius:o}),e.parentNode.style.color=GN.chordColorBase[a]}else{e.style.fontWeight="normal",e.parentNode.style.color="#000000";for(c=0;c<GN.chordsSelect.length;c++){var l=GN.chordsSelect[c];if(l.note==t&&l.chord==n){for(s=0;s<GN.chordsSelect[c].additions.length;s++){document.getElementById("GNaddN"+GN.chordsSelect[c].note+"C"+GN.chordsSelect[c].chord+"A"+GN.chordsSelect[c].additions[s]).style.fontWeight="normal"}GN.chordsSelect.splice(c,1);break}}}GN.drawNeck()},clickOption:function(e,t,n,o){if(""==e.style.fontWeight||"normal"==e.style.fontWeight){for(var r=-1,s=0;s<GN.chordsSelect.length;s++)if(GN.chordsSelect[s].note==t&&GN.chordsSelect[s].chord==n){r=s;break}if(-1==r){var a=document.getElementById("GNCN"+t+"C"+n);GN.clickChord(a,t,n),r=GN.chordsSelect.length-1}e.style.fontWeight="bold",GN.chordsSelect[r].additions.push(o),GN.drawNeck()}else{e.style.fontWeight="normal";for(s=0;s<GN.chordsSelect.length;s++)if(GN.chordsSelect[s].note==t&&GN.chordsSelect[s].chord==n){GN.chordsSelect[s].additions.splice(GN.chordsSelect[s].additions.indexOf(o),1);break}GN.drawNeck()}},flipStrings:function(){for(var e=GN.stringTunings.length,t=0;t<Math.floor(e/2);t++){var n=GN.stringTunings[e-1-t];GN.stringTunings[e-1-t]=GN.stringTunings[t],GN.stringTunings[t]=n}GN.drawNeck()}};