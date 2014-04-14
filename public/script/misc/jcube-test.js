/**
 * New node file
 */

function jCubeByI()
{
	//return 
	{
		resetColumn:1
	   	//success: function(d,txt,xhr) {
	   		//var cube=xhr.srcObject;
				//cube.resetColumn(d,xhr);
				//cube.insertData(d,xhr);
	   	//}
		
	};
	var ret = 
	{
		resetColumn: function(d, xhr)
		{
			/*
	 	    var cube = this, cw = [],vCol = cube.vCol, s = xhr.getResponseHeader('groupColumn');
			while (vCol.cols.length >0) vCol.cols.pop();
			  if (defined(s) && s!="" ) vCol.vCols=decodeURIComponent(s); //IE8 s == "" default 
		    s=xhr.getResponseHeader('verticalColumn');
			  if (defined(s) && s!="") {
			  	var w=decodeURIComponent(s).split(',');
			  	each(w, function(v,i) { vCol.cols.push({name:v}); });
			  	*/
			
			
		},
		success: function(d, txt, xhr, json)
		{
			
		}
	};
	return ret;
}

$(document).ready(function() {
	
	var tblOption = {
		type: 'lazy-cube',
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		table: {
			height:400, 
			width:800
		},
		name: 'Lazy Cube',
		header: {
			
			measures: { 
				BARE_COST:
				{
					width: 70, 
					name: 'QTY'
				}, 
				YIELD_COST:
				{
					width: 80, 
					name: 'AMT' 
				}
			}			
		},
		hCol://row dimension
		[				
			{
				id: 'mfgCat',
				name: '製造種類'
			},
			
			{
				id: 'plant',
				name: '週別'
			}
		],
		vCol://column dimension
		[
			{
				id: 'number',
				name: '號碼'
			},
			{
				id: 'costCat', 
				name: '樣式'
			}
		],
		style:{
			position:'absolute',
			top:'20px', 
			left:'10px'
		},
		bodies:[{id:'bd1'}],
		toolbar:  {
			pager:false,				
		},
		ajaxOptions: {
		},
		plotOptions:{
			rows: {
				formatter: function(cube) {
					if (cube.scrollX) {
					  	r= r.parentNode.neighbor.childNodes[r.sectionRowIndex];
					  	for (c=r.firstChild,i=0;c;c=c.nextSibling,i++) {
					  		c.innerText=addCommas(c.innerText,0);
					  	}
					}
				}
			}
		}
	};
	
	var jt = new jTable(tblOption);
	
	ajax({
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		withCredentials: true,
		success: function(d, txt, xhr, json)
		{
			jt.resetColumn(d, xhr);
			
		}
	});
	
	
/*
 * 	var tblOption={
	 	  type:'cubeTable',
	 	  name:'GIM', // aspx file name gim.aspx 
	 	  table: {height:400, width:800},
			header: {
				measures: { 
					BARE_COST:{width:70, name:'QTY'}, 
					YIELD_COST:{width:80, name:'AMT' }
				}   
			},
			style:{
				position:'absolute',
				top:'20px', 
				left:'10px'},  // ��position=absolute �ɡA�H���]�wposition�����`�I��content ������
			bodies:[{id:'bd1'}],
			toolbar:  {
				pager:false,
				btn:[
				  {type:'button',value:'',cls:'GMToolReload',f: function() {l_cube.reloadData()} },
					{cls:'GMToolExport'} ,
					{cls:'toolbarPrint', f: function() { 
							var jp = new jPrinter({orientation:'portrait', css:["http://tnvinxbms.cminl.oa/Styles/jTable/Elegant/treeTable.css"]});				
							l_tbMain.print(jp);				
							}  }	] },
			ajaxOptions: {
			},
			plotOptions:{
				rows: {
					formatter: function(cube) {
							var c,r=this,i=0;	  		  
	  					for (c=r.childNodes[r.data.layer+1];c;c=c.nextSibling,i++) {
	  						c.innerText = addCommas(c.innerText,0);
						  
						  }
						  if (cube.scrollX) {
						  	r= r.parentNode.neighbor.childNodes[r.sectionRowIndex];
                for (c=r.firstChild,i=0;c;c=c.nextSibling,i++) {
                c.innerText=addCommas(c.innerText,0);
                }
						  }
					}
				}
			}
		};
	var tbMain = new jTable(tblOption);
	tbMain.loadData();
//	tbMain.filter = divFilter;
	return tbMain;
 * 
 * 
 * */	
});
