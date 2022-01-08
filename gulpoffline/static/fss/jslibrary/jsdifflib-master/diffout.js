function diffUsingJS(viewType) {
	"use strict";
	var byId = function (id) { return document.getElementById(id); },
		base = difflib.stringAsLines(byId("orgCntntsCn").value),
		newtxt = difflib.stringAsLines(byId("modCntntsCn").value),
		sm = new difflib.SequenceMatcher(base, newtxt),
		opcodes = sm.get_opcodes(),
		diffoutputdiv = byId("diffoutput"),
		contextSize = byId("contextSize").value;

	diffoutputdiv.innerHTML = "";
	contextSize = contextSize || null;

	var baseVer = $("#orgVer").text();
	var newVer = $("#modVer").text();

	diffoutputdiv.appendChild(diffview.buildView({
		baseTextLines: base,
		newTextLines: newtxt,
		opcodes: opcodes,
		baseTextName: "원본 콘텐츠(" +baseVer+")",
		newTextName: "수정 콘텐츠(" +newVer+")",
		contextSize: contextSize,
		viewType: viewType
	}));
}