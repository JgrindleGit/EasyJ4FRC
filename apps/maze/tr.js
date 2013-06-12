// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof mazepage == 'undefined') { var mazepage = {}; }


mazepage.start = function(opt_data, opt_ignored, opt_ijData) {
  var output = '<div id="MSG" style="display:none"><span id="moveForward">ileri git</span><span id="turnLeft">sola dön</span><span id="turnRight">sağa dön</span><span id="doCode">yap</span><span id="elseCode">yoksa</span><span id="pathAhead">eğer önde yol varsa</span><span id="pathLeft">eğer solda yol varsa</span><span id="pathRight">eğer sağda yol varsa</span><span id="repeatUntil">kadar tekrar et</span><span id="moveForwardTooltip">Pegman\'i bir boşluk ileri götürür.</span><span id="turnTooltip">Pegman\'i sola veya sağa döndürür.</span><span id="ifTooltip">Eğer belirtilen yönde yol varsa, \\nbelirtilen hareketleri yap. </span><span id="ifelseTooltip">Eğer belirtilen yönde yol varsa, \\nbelirtilen hareketleri ilk bloğunu \\nyap, yoksa ikinci bloğu yap. </span><span id="whileTooltip">Bitiş noktasına ulaşana kadar kapsanan \\nhareketleri yap. </span><span id="capacity0">0 adet bloğun kaldı.</span><span id="capacity1">1 adet bloğun kaldı.</span><span id="capacity2">%1 adet bloğun kaldı.</span><span id="nextLevel">Tebrikler! %1. seviyeye geçmeye hazır mısın?</span><span id="finalLevel">Tebrikler! Son seviyeyi de tamamladın!</span><span id="oneTopBlock">Bu bölümde beyaz çalışma alanındaki bütün blokları bir araya getirmelisin.</span></div><table width="100%" height="100%"><tr height="50"><td colspan=2><h1><a href="../index.html"><span id="blocklyName">Blockly</span></a> &gt; <span id="maze">Labirent</span>&nbsp;';
  for (var i103 = 1; i103 < 11; i103++) {
    output += ' ' + ((i103 == opt_ijData.level) ? '<span class="tab" id="selected">' + soy.$$escapeHtml(i103) + '</span>' : (i103 < opt_ijData.level) ? '<a class="tab previous" href="?level=' + soy.$$escapeHtml(i103) + '">' + soy.$$escapeHtml(i103) + '</a>' : '<a class="tab" href="?level=' + soy.$$escapeHtml(i103) + '">' + soy.$$escapeHtml(i103) + '</a>');
  }
  output += '</h1></td></tr><tr><td width="410" valign="top"><div style="position: relative"><div id="hintBubble"><div id="hint">';
  switch (opt_ijData.level) {
    case 1:
      output += 'Program demek, bir ifadeler sıralaması demektir. Bir kaç \'ileri git\' bloğunu bir araya getirerek beni hedefe ulaştır.';
      break;
    case 2:
      output += 'Bu yolu izlemek için hangi adımları izlemeli?';
      break;
    case 3:
      output += 'Bilgisayarların sınırlı hafızaları vardır. Bu yüzden sende hedefe sadece iki blok kullanarak ulaşmalısın. \'tekrar\' bloğunu kullanarak aynı bloğu birden fazla kullanabilirsin.';
      break;
    case 4:
      output += 'Hedefe sadece beş blok kullanarak ulaş.';
      break;
    case 5:
      output += 'Pegman ileri gidemediğinden sola dönmeli.';
      break;
    case 6:
      output += 'Bir \'eğer\' koşulu ancak belirtilen koşul doğru oluyorsa birşeyler yapar. Eğer solda yol varsa sola dönmeyi dene.';
      break;
    case 7:
      output += 'Bu labirent öncekine göre daha karmaşık gözüküyor, ama aslında öyle değil.';
      break;
    case 8:
      output += 'Birden fazla \'eğer\' ifadesi kullanabilirsin.';
      break;
    case 9:
      output += 'Eğer-değilse ifadeleri ya bir şeyi ya da diğerini yapar.';
      break;
    case 10:
      output += 'Bu karmaşık labirenti de çözebilir misin? Soldaki duvarı dene. Sadece gelişmiş programcılar için!';
      break;
  }
  output += '</div></div><svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svgMaze" width="400px" height="450px"><g id="look"><path d="M 0,-15 a 15 15 0 0 1 15 15" /><path d="M 0,-35 a 35 35 0 0 1 35 35" /><path d="M 0,-55 a 55 55 0 0 1 55 55" /></g></svg><div id="capacityBubble"><div id="capacity"></div></div></div><table width="100%"><tr><td style="width: 190px; text-align: center"><button title="Oluşturulan JavaScript kodunu görüntüle." onclick="Blockly.Apps.showCode();"><img src=\'../../media/1x1.gif\' class="code"></button><button id="linkButton" title="Blokları ve bağlantı adresini kaydet." onclick="BlocklyStorage.link();"><img src=\'../../media/1x1.gif\' class="link"></button><button id="randomizeButton" title="Başlangıç ve bitiş adreslerini rastgele yerleştir. onclick="Maze.randomizeMarkers();" style="display: none"><img src=\'../../media/1x1.gif\' class="random"></button></td><td style="width: 15px;"><img id="spinner" style="visibility: hidden;" src="loading.gif" height=15 width=15></td><td><button id="runButton" class="launch" onclick="Maze.runButtonClick();">Programı Çalıştır</button><button id="resetButton" class="launch" onclick="Maze.resetButtonClick();" style="display: none">Tekrar</button></td></tr></table></td><td valign="top"><script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../generators/javascript.js"><\/script><script type="text/javascript" src="../common.js"><\/script><script type="text/javascript">Blockly.Apps.loadLanguageScripts(languageSrc);<\/script><script type="text/javascript" src="blocks.js"><\/script>' + mazepage.toolbox(null, null, opt_ijData) + '<div id="blockly"></div></td></tr></table>';
  return output;
};


mazepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><block type="maze_moveForward"></block><block type="maze_turn"><title name="DIR">turnLeft</title></block><block type="maze_turn"><title name="DIR">turnRight</title></block>' + ((opt_ijData.level > 2) ? '<block type="maze_forever"></block>' + ((opt_ijData.level == 6) ? '<block type="maze_if"><title name="DIR">isPathLeft</title></block>' : (opt_ijData.level > 6) ? '<block type="maze_if"></block>' + ((opt_ijData.level > 8) ? '<block type="maze_ifElse"></block>' : '') : '') : '') + '</xml>';
};