---
layout: default
---
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="{{ page.title }}" />
<meta name="twitter:title" content="{{ page.title }}" />
<meta name="twitter:image" content="{{ page.title_image }}" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="js/random_quote.js"></script>

<center>
<h2>👋&nbsp;&nbsp;Welcome back, adventurer!</h2>
<h4 id = "id_subtitle"> </h4>
<p style="margin-bottom:28px;"></p>


<div class="card">
<h1 id = "id_emoji"/>
<h2 id = "id_name"/>
<h3 id = "id_stats"/>
<h4 id = "id_desc"/>
<h5 id = "id_type"/>
</div>

<p style="margin:28px;"></p>

<div class="quest">
<h4 id = "id_quest_text" style="margin-bottom:0px;"/>
</div>

<p style="margin:22px;"></p>

<button type = "button" id = "button_attack">🗡&nbsp;&nbsp;Attack</button>&nbsp;
<button type = "button" id = "button_block">🛡&nbsp;&nbsp;Block</button>&nbsp;
<button type = "button" id = "button_magic">🪄&nbsp;&nbsp;Magic</button>&nbsp;

<p style="margin:10px;"></p>

<button type = "button" id = "button_heal">❤️&nbsp;&nbsp;Heal</button>&nbsp;
<button type = "button" id = "button_sleep">💤&nbsp;&nbsp;Sleep</button>&nbsp;
<button type = "button" id = "button_cheese">🧀&nbsp;&nbsp;Cheese</button>&nbsp;
</center>
