/**
 * New node file
 */


$(document).ready(function() {
	var tblOption = {
		id: 'tb1',
		type: 'lazy-cube',
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		parentNode: $('#jCubeContainer')[0],
		table: {
			height: 400, 
			width: 1000
		},
		name: 'Lazy Cube',
		header: {
			
			measures: 
			{ 
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
				name: '製造種類',
				width: '100px'
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
		/*style:{
			position:'absolute',
			top:'20px', 
			left:'10px'
		},*/
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
	var tblOption0 = $.extend({}, tblOption);
	tblOption0.id = 'tb0';
	tblOption0.bodies = [{id: 'bd0'}];
	tblOption0.lazy = true;
	var jt = new jTable(tblOption0);
	
	
	var jt2 = new jTable(tblOption);
	/*
	$.ajax({
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		xhrFields: {
		    withCredentials: true
		}
	})
	.done(function(raws) {
		jt.resetPivot(raws.data);
		//jt.resetColumn(raws.data);
		//jt.postResetColumn();
		//var data = jt.pivot(raws.data);
		//jt.insertData(data);
	});*/

	ajax({
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		withCredentials: true,
		success: function(d, txt, xhr) {
			var raws = JSON.parse(xhr.responseText);
			jt.resetPivot(raws.data);
			var data = jt.pivot(raws.data);
			jt.insertData(data);
		}		
	});

	ajax({
		url: 'http://tnvcmipad.cminl.oa/mvc/test/testc2',
		withCredentials: true,
		success: function(d, txt, xhr) {			
			var raws = JSON.parse(xhr.responseText).data;
			var data;
			jt2.resetColumn(raws);
			jt2.postResetColumn();
			data = jt2.pivot(raws);
			jt2.insertData(data);
		}		
	});
	/*
	 * 取得各dimension的values
	 * */
	function generateDimensionValues1(cols, data) {
		var distinctColValues = [];
        each(cols, function (col, idx) {
        	/*var currentCol = 
        	{
    			id: col.id,
    			values: []
    		};*/        	
        	col.values = [];
            tmpLookup = {};
            each(data, function (item, j) {
                if (!(item[col.id] in tmpLookup)) {
                    tmpLookup[item[col.id]] = 1;
                    //distinctColValues.push(item[col.id]);
                    col.values.push(item[col.id]);
                }
            });
        });
    }
	
	
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
