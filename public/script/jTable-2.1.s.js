/* ------------
ver 2.1  2013/10 
new freature
1. jAC (autoComple Object)
2. ajax return xmlHttp is success and can abort previsou ajax call if (abort=true) 
3. array.crossTab (modify for performace cube transform) - jTable 2.0 above 
4. cubeTable, treeTable, vCol, hCol object for multidemension reporting  2014/02
5. array.prototype.indexOf for IE8
ver 2.0
1.merget, deepExtend from Chart file
2. crossTab : remvoe cellElement parameter
3. remove td_clkDetail and eachElements func
--------------
cross tabel fucntion for two dimention array, replace the iTbody.crossTab for performance issue 
param@
xCos([int...]): array of xAxis columns index ex. [0,1,2]
yCol(int) : yAxis column index to be evaluated
maxXcol(int) : the length of each row (array)
f : function to evaluate column index such as f(x)= 2x+1, for each x in Array[][yCol]
o : pass parameters to f function, first is ycol value
   
o.ml(int) : the number of measure columns,  ex. qty, amt, count(*) etc
* default o.ml = 1
* default yCol only one column, 如果大於1 則需要設定 o.ml , 用 array.length - o.ml = yCols.length */
var oldIndexOf = Array.prototype.indexOf;
Array.prototype.indexOf = function (str) {
    var i, array = this;
    if (oldIndexOf) return oldIndexOf.call(array, str);
    else {
        for (i = 0; i < array.length; i++) {
            if (str == array[i]) return i;
        }
        return -1;
    }
}
Array.prototype.crossTab = function (xCols, yCol, maxXCol, f, o) {
    var d = this, j, eql = true, d0 = d[0], dd, idx = 0, idx0 = 0;

    if (!defined(o)) o = { ml: 1 };
    else if (!defined(o.ml)) o.ml = 1;
    o.yl = d0.length - yCol - o.ml
    o.yCol = yCol;
    if (!defined(o.ttl)) o.ttl = maxXCol;
    /* initial ma and yCols */
    dd = d0.slice(0);
    while (d0.length < maxXCol) d0.push(0);
    for (j = 0; j < o.ml + o.yl; j++) d0[yCol + j] = 0;
    eql = true;
    while (dd) {
        /* backUp yCols, backup the measure column  */
        if (!eql) {
            for (j = 0, eql = true; j < xCols.length; j++) {
                if (dd[xCols[j]] != d0[xCols[j]]) {
                    d0 = dd; idx0 = idx; eql = false;
                    /* clone row and clean d0 with 0 */
                    dd = d0.slice(0);
                    while (d0.length < maxXCol) d0.push(0);
                    for (j = 0; j < o.ml + o.yl; j++) d0[yCol + j] = 0;
                    break;

                }
            }
        }
        /* update d0 */
        f.apply(d0, [dd, o]);
        //如果與前一行，同分類值且非第一行，則搬完後刪除該行
        if (eql && idx > 0) d.splice(idx, 1);

        if (d.length > idx0 + 1) {
            dd = d[idx0 + 1];
            idx = idx0 + 1;
            eql = false;
        }
        else break; //r = r0.nextSibling;		
    }
}
Date.prototype.addMonth = function (d) {
    var elm = this;
    if (d == 0 || d === undefined) return elm;
    else {
        var i = (d > 0) ? 1 : -1;
        elm.setMonth(elm.getMonth() + i);
        return elm.addMonth(d - i);
    } 
}

/* set the value by string,format 
s: string, 2012-08-16
f: format, yyyy-mm-dd 
*/
Date.prototype.format = function (s, f) {
    if (s.length != f.length) return false;
    var c0 = '', iY = 0, iM = 0; iD = 0;
    for (i = 0; i < f.length; i++) {
        c = f.substr(i, 1);
        if (c == 'y') iY = (iY * 10) + s.substr(i, 1).toInt();
        else if (c == 'm') iM = (iM * 10) + s.substr(i, 1).toInt();
        else if (c == 'd') iD = (iD * 10) + s.substr(i, 1).toInt();
    }
    if (iY > 0) {
        if (iY < 100) this.setYear(iY + 2000); // 只有兩位數 1900  + iY
        else this.setYear(iY);
    }
    this.setDate(1); // 避免 when date=31, 5/31 -->  d.setMonth(4) ==> 5/1
    if (iM >= 1) this.setMonth(iM - 1);
    if (iD > 0) this.setDate(iD);
    return true;
}

Date.prototype.getMonthEnd = function () {
    var m = this.getMonth();
    if (m == 1) { var d = new Date(this.getFullYear(), 2, 1, 0, 0, 0, 0); d.setDate(0); return d.getDate(); }
    else if (m == 0 || m == 2 || m == 4 || m == 6 || m == 7 || m == 9 || m == 11) return 31;
    else return 30;
}

Date.prototype.toString = function (f) {
    var d = this;
    if (f === undefined || f == '') return String(d.getDate() + (d.getMonth() + 1) * 100 + d.getFullYear() * 10000);
    else {
        var s = "";
        s = f.replace('yyyy', d.getFullYear());
        s = s.replace('yy', String(d.getYear()).substr(1));
        s = s.replace('mi', String(d.getMinutes() + 101).substr(1));
        s = s.replace('mm', String(d.getMonth() + 101).substr(1));
        s = s.replace('hh', String(d.getHours() + 101).substr(1));
        return s.replace('dd', String(d.getDate() + 100).substr(1));
    } 
}
/* remove i character from rigth */
String.prototype.rTrimLen = function (i) {
    var j = (i > this.length) ? 0 : this.length - i;
    return this.substr(0, j);
}

/* get the right i characters */
String.prototype.rSubLen = function (i) {
    var j = (this.length < i) ? 0 : this.length - i;
    return this.substr(j, i);
};

String.prototype.toInt = function () { var i = parseInt(this.replace(/,/g, ''), 10); return isNaN(i) ? 0 : i; };
String.prototype.toFloat = function () { var f = parseFloat(this.replace(/,/g, '')); return isNaN(f) ? 0 : f; };

String.prototype.trim = function () { return (this.length > 0 && this.substr(0, 1) == ' ') ? this.substr(1).trim() : this; };

/*
以下是global function 放在 J10Adapter理
其他 project 可呼叫使用，
方法是
addCommas = J10Adapter.addCommas
*/

(function () {
    var WIN = window, DOC = document;
    WIN.J10Adapter = {};
    WIN.animAttr = new Array();
    WIN.animIdx = 0;

    /*+ parserIdx gFunction.addCommas(x,t) : string
    x(string): the string  
    t(integer):小數點位數  
    add comma to a number addCommas(1234.78,1) -> 1,235.8
    x: number, t: precision digits to be round, 12.6 -> */

    function addCommas(x, t) {
        var x1, nx = Number(x);
        if (isNaN(nx)) return x; else x1 = nx.toFixed(t);
        var rgx = /(\d+)(\d{3})/; while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2'); return x1;
    }

    // bind event to object, for user defined and HTML DOM by jiantian
    function addEvent(el, e, fn) {
        if ('addEventListener' in el) el.addEventListener(e, fn, false); //W3
        else if ('attachEvent' in el) {
            el.attachEvent('on' + e, fn); //IE
        }
        else {
            el['on' + e] = fn; // compatiable older browser
        }
    }

    /*+ parserIdx gFunction.addMonth(m:string,i:integer)
    m(string) : format yyyymm
    i(integer) : exp : addmonth('201201',-1) => '201112' */
    function addMonth(m, i) {
        var j = Math.round(i);
        if (j == 0) return String(m);
        else if (j > 0) {
            var s = parseInt(m, 10) + 1;
            if (String("" + s).substr(4, 2) == '13') s = (parseInt(m.substr(0, 4), 10) + 1) + '01'; // 201212 ==> 201301 

            return addMonth(String(s), j - 1); //0910 modify by wenling [s to string]
        }
        else { /* j<0 */
            var s = parseInt(m, 10) - 1;
            if (String("" + s).substr(4, 2) == '00') s = (parseInt(m.substr(0, 4), 10) - 1) + '12'; // 201201 ==> 201112 
            return addMonth(String(s), j + 1);
        }
    }
    /*+ gFunction.aGb(0)
    is a greater then b */
    function aGb(o) {
        if (o.dataType == 'i' || o.dataType == 'f') { /*integer*/
            var fa = parseFloat(o.a.replace(/,/g, ''));
            var fb = parseFloat(o.b.replace(/,/g, ''));
            if (fa == fb) return 0;
            else if (fa > fb) return (o.asec) ? -1 : 1;
            else return (o.asec) ? 1 : -1;
        }
        else {
            if (o.a == o.b) return 0;
            if (o.a > o.b) return (o.asec) ? -1 : 1;
            else return (o.asec) ? 1 : -1;
        } 
    }

    /* 
    參數屬性
    1. url(string)  : default Tbl2JSON.aspx 
    2. dataType(string) : 回傳資料格式 default 'json'
    json : json string array, eachRow(d) , d is an array, success(d,,) d is an tow dimension array
    jsonColName : d is an Object with attribute name such as {c1:'a', c2:2}
    xml: xml format
    xmlWS: xml for webService
    http: http text
    3. async(boolean) : true - 非同步
    4. data(object) : 傳給ajax(aspx) 的參數 例如 data: {p1:'aa', dbSID:'sdb2', sqlstr:'select ....' }
    5. eachRow(function(d) ) : call back function 每一行都會呼叫一次eachRow, d: 該行資料 d is an array or an object (dataType 設定）
    6. success(function(d,sts,hdr)) : ajax 執行成功後呼叫之call back function, sts: hdr is xmlHddr
    7. error(function(hdr,sts,txt)) : 執行失敗時呼叫之處理程序
    8. lockAjax(object) :  是否lock ajax 禁止同時一個以上的 ajax
    lockAjax.elm : element 呼叫
    lockAjax.xmlHdr :  (optional) if defined 上一次 ajax 的 xmlHttpRequest , 用來強制abort
    */
    function ajax(o) {
        var xmlHttp, t = extend({ async: true, url: g_URL + 'ajax/Tbl2JSON.aspx', dataType: 'json', withCredentials: false }, o);
        if (o.lockAjax) {
            if (!lockAjax(true, o.lockAjax.elm, true, o.lockAjax.xmlHdr)) {
                return false;
            }
        }
        if (t.data && t.data.dbSID) setAuth(t.data);

        if (window.XMLHttpRequest) { g_isIE = false; xmlHttp = new XMLHttpRequest(); } // code for IE7, Safari
        else { g_isIE = true; xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); } // g_isIE6=true,code for IE5, IE6,Msxml2.XMLHTTP.3.0
        if (!xmlHttp) { o.error(xmlHttp, 'xmlHttp create error', ''); return false; }
        var k = 0;
        try {
            xmlHttp.srcObject = this; /* try for IE6 got error */
        } catch (e) { }
        var kk = 0;
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (t.lockAjax) lockAjax(false, t.lockAjax.elm, false);
                if (xmlHttp.status == 200 || xmlHttp.status == 0) {
                    if (t.withCredentials == false) {
                        var errorCode = xmlHttp.getResponseHeader("errorCode");
                        if (xmlHttp.responseText == "[]" || (errorCode != "" && errorCode != null)) {
                            if (o.error) o.error(xmlHttp, xmlHttp.responseText, xmlHttp.statusText);
                            else if (errorCode) alert(xmlHttp.responseText);
                            return;
                        }
                    }

                    if (t.init) t.init(xmlHttp);
                    if (t.dataType == 'json' || t.dataType == 'jsonColName' || t.dataType == 'jsonArray' || t.dataType == 'jsonObject') {
                        var i, j, r, rows = 0,
                            c, d = new Array(),
                            names = [],
                            s = xmlHttp.responseText;
                        if (t.dataType == 'jsonArray') {
                            s = s.substr(1, s.length - 2);
                        }
                        var separator
                          , QMB = ']' /*  "] quotation mark and Brackets */
                          , lenSep = 3; // length of ],[
                        if (t.withCredentials == false) {
                            separator = xmlHttp.getResponseHeader("separator");
                        }
                        if (!defined(separator) || separator == "") separator = ',';
                        else { separator = decodeURIComponent(separator); lenSep = separator.length + 2 };
                        c = s.substr(0, 1);
                        while (c == '[' || c == '"') { /* 1. will cause parseing error if first character is  '[' or '"', 2. if ',' occurred in data should chagne separator */
                            s = s.substr(1);
                            c = s.substr(0, 1);
                            if (c == '"') { QMB = c + ']'; separator = c + separator + c; lenSep += 2; }
                        }
                        j = s.search(QMB);
                        if (t.dataType == 'json' || t.dataType == 'jsonArray' || t.dataType == 'jsonObject') { // two dim s= [["xxx","yyyy","www"],["ss","zzz"]]

                            while (j >= 0 && rows++ < gc_maxRowNo) {
                                if (j == 0) c = [null];
                                else c = s.substr(0, j).split(separator);
                                if (t.eachRow) t.eachRow(c, xmlHttp); /* version after 2.1 can got srcObject from xmlHttp */
                                d.push(c);
                                s = s.substr(j + lenSep);
                                j = s.search(QMB);
                            }
                            /* json object array with column name
                            first line with the column name, and following with data rows, such as data = [{col1: 4, col2: 'aa'}, {...} ] */
                        }
                        else { // json object array with column name
                            if (j > 0) { // get the column names
                                names = s.substr(0, j).split(separator);
                                s = s.substr(j + lenSep); j = s.search(QMB);
                            }
                            var kk = 0;
                            while (j > 0 && rows++ < gc_maxRowNo) {

                                c = s.substr(0, j).split(separator);
                                var obj = {};
                                for (i = 0; i < names.length; i++) obj[names[i]] = c[i];
                                if (t.eachRow) t.eachRow(obj);
                                d.push(obj);
                                s = s.substr(j + lenSep); j = s.search(QMB);
                            }
                        }
                        var json = (t.dataType == 'json' ? JSON.parse(xmlHttp.responseText) : undefined);
                        if (o.success) o.success(d, xmlHttp.statusText, xmlHttp, json);
                    }
                    else if (t.dataType == 'xml' && o.success) o.success(xmlHttp.responseXML, xmlHttp.statusText, xmlHttp);
                    else if (t.dataType == 'xmlWS' || t.dataType == 'soap') {
                        var obj = {}, elm = (jInfo.isIE) ? xmlHttp.responseXML.documentElement.firstChild : xmlHttp.responseXML.documentElement.firstElementChild;
                        for (; elm; ) {
                            obj[elm.tagName] = pick(elm.textContent, elm.text);
                            elm = (jInfo.isIE) ? elm.nextSibling : elm.nextElementSibling;
                        }
                        o.success(obj, xmlHttp.responseXML, xmlHttp);
                    }
                    else if (o.success) o.success(xmlHttp.responseText, xmlHttp.statusText, xmlHttp);
                    var fun = 'on' + t.onready, srcObj = xmlHttp.srcObject;
                    /* fireEvent Sarfari event.srcElement=xhdr but not IE8  */
                    if (defined(srcObj) && defined(srcObj[fun])) srcObj[fun].apply(srcObj, [xmlHttp]);
                } else if (xmlHttp.status != 200 && o.error) o.error(xmlHttp, xmlHttp.statusText, xmlHttp.statusText);
            } /* end of ready */
        };

        if (g_isIE == false) {
            xmlHttp.withCredentials = t.withCredentials;
        }
        xmlHttp.open(defined(o.method) ? o.method : 'POST', t.url, t.async); //bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword
        var s = '';
        if (o.dataType == 'jsonObject') {
            xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            if (t.data) {
                var json = JSON.stringify(t.data);
                xmlHttp.send(json);
            }
        }
        else if (o.dataType == 'soap') {
            if (typeof t.data == 'string') {/* 還沒想好要怎麼接soap的content比較適合 */
                xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                var xml = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                        'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
                        '<soap:Body> ' +
                        t.data +
                        '</soap:Body>' +
                        '</soap:Envelope>';
                xmlHttp.send(xml);
            }
        }
        else {
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (o.dataType == 'xmlWS') {
            }
            else if (o.dataType == 'xml') xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
            else xmlHttp.setRequestHeader("Content-Type", "text/html; charset=UTF-8");

            for (var p in t.data) s += '&' + p + '=' + encodeSql(t.data[p]);
            try {
                if (t.dataType == 'jsonColName' && !defined(t.colName)) s += '&colName=true';
                xmlHttp.send(encodeURI(s.substr(1)));
            }
            catch (e) { if (o.error) o.error(xmlHttp, e.description, e); return false; }
            return xmlHttp;
        }
    }

    /* s: start value
    t: target value
    d: delta value
    fStart : before animate ??
    fAttr : attribute to be set and return the value to anim.val
    fStop : stop animate function
    example 
    1: animate.apply(elm, ['left',60]);
    2: animate.apply(elm, [0,60,null,function(d){var v=this.style.left.toInt()+d; this.style.left=v+'px', return v;} ]);
    3: animate.apply(elm, [0,60,2,function(d){var v=this.style.left.toInt()+d; this.style.left=v+'px', return v;}, function() {this.style.left='60px';}  ]);
    add step>60 prevent stack overflow
    */
    function animate(s, t, d, fAttr, fStop, steps, intv) {
        var val = s, elm = this;
        var msec = pick(intv, 16);
        var step = pick(steps, 20);
        steps = step;
        if (typeof (s) == 'string') {
            var ss = s.substr(0, 4);
            if (ss == 'scro') {
                fAttr = function () { var elm = this; elm.anim.val += d; elm[s] = elm.anim.val; return elm.anim.val; };  //scrollLeft, scrollTop
                if (!defined(d)) d = (t - elm[s]) / step;
                val = elm[s];
            }
            else {
                fAttr = function () { var elm = this; elm.anim.val += d; elm.style[s] = elm.anim.val + 'px'; return elm.anim.val; };
                if (!defined(d)) d = (t - elm.style[s].toFloat()) / step;
                val = elm.style[s].toFloat();
            }
        } else if (typeof (s) == 'object' && !defined(d)) {
            d = {};
            for (k in s) if (typeof (s[k]) == 'number') d[k] = (t[k] - s[k]) / step;
        } else if (!defined(d)) d = ((t - s) / step); /* default 2 seconds */

        var intf = function (attrIdx) {
            /* elm or elm.anim may been cleared, use WIN.animAttr for backup, prevend never ended loop */
            var idx = 0;
            for (; idx < WIN.animAttr.length; idx++) {
                if (WIN.animAttr[idx].idx == attrIdx) break;
            }
            if (!defined(elm) || !defined(elm.anim)) {
                if (WIN.animAttr.length > idx) {
                    WIN.clearInterval(WIN.animAttr[idx].interval);
                    WIN.animAttr.splice(idx, 1);
                }
                return;
            }
            if (defined(elm.anim.step) && elm.anim.step >= step) {
                if (WIN.animAttr.length > idx) {
                    WIN.clearInterval(WIN.animAttr[idx].interval);
                    WIN.animAttr.splice(idx, 1);
                } else WIN.clearInterval(elm.anim.interval);
                if (fStop) fStop.apply(elm);
                elm.anim = null;
            } else {
                elm.anim.step++;
                if (!jInfo.isIE && elm.anim.step == (steps - 3) && (typeof (d) != 'object')) { d = (d / 4.0); step = step + 12; } /* slow down */
                try { elm.anim.val = fAttr.apply(elm, [d, WIN.animAttr[idx]]); }
                catch (e) {
                    WIN.clearInterval(WIN.animAttr[idx].interval);
                    if (fStop) fStop.apply(elm);
                    WIN.animAttr.splice(idx, 1);
                    elm.anim = null;
                }
            }
        }
        /* 16 mini sec = 1/60 sec */
        if (defined(t) && defined(s) && !defined(elm.anim)) {
            WIN.animIdx += 1;
            var l = WIN.animAttr.length;
            elm.anim = { step: 0, val: val, idx: WIN.animIdx };
            WIN.animAttr.push({ step: 0, val: val, idx: WIN.animIdx }); /* idx will cause error */
            var intv = WIN.setInterval(intf, msec, WIN.animIdx);
            WIN.animAttr[l].interval = intv;
            elm.anim.interval = intv;
        }
        else if (fStop) fStop.apply(elm);
    }

    /*+ appendChild(me,o)= object (child)
    append a child to me
    o.idx(integer,-1) : the index to be insert before, -1: insert at the end
    o.child(object,null) : the child object
    o.tag (string): the tag name of the child (document.createElement), such as 'TR','DIV','TD' ...
    o.attr(object): the attribute to be set to, exp. {id:'myid', innerHTML:'xx', style:'widht:10px;display:none'}
    where sytle should be separeated by ';' and no "'"
    return the child object
    endParser*/
    function appendChild(me, o) {
        var c;
        try { c = document.createElement(o.tag); }
        catch (e) { alert(e.description + o.tag); }
        if (o.type) {
            try { c.type = o.type; } /* IE can't set input type=button*/
            catch (e) { c = document.createElement(o.tag + " type=" + o.type); }
        }
        if (o.insBefore) {
            me.insertBefore(c, o.insBefore);
            o.insBefore = undefined;
        }
        else if (me) me.appendChild(c);
        else return null;
        for (var key in o) {
            if (key == 'style') {
                var a = o.style.split(';'), i, j;
                for (i = 0; i < a.length; i++) {
                    j = a[i].search(':');
                    try {
                        if (j > 0) c.style[a[i].substr(0, j)] = a[i].substr(j + 1);
                    }
                    catch (e) { alert(a[i]); }
                }
            }
            else if (key != 'type' && key != 'tag' && defined(o[key])) {
                try { c[key] = o[key]; }
                catch (e) { alert(e.description + key + '=' + o[key] + 'value=' + o.value); }
            }
        }
        return c;
    }


    /* gFunction.decodeHTML(stmp) = String
    stmp(string)
    +,& will decoded at aspx before save into database except
    0D0A=<br>, 0x0027=' 0x0022=", so decode this code before show at cell.innerHTML
    end */
    function decodeHTML(stmp) {
        if (stmp) {
            var ret = stmp.replace(/0x0027/g, "'");  /* replace 0x0027 to ' */
            ret = ret.replace(/0x0022/g, '"');
            ret = ret.replace(/0x003C/g, "<");
            ret = ret.replace(/0x003E/g, ">");
            return ret.replace(/0D0A/g, "<br>");
        }
        else return "";
    }
    //


    function defined() {
        var obj = arguments[0], i;
        if (typeof obj == 'undefined' || obj === null) return false;
        else {
            for (i = 1; i < arguments.length; i++) {
                obj = obj[arguments[i]];
                if (typeof obj == 'undefined' || obj === null) return false;
            } 
        }
        return true;
        //return (obj !== undefined && obj !== null);
    }

    /* remove ojbect attribue IE6 delete obj.attr got error 
    prop : array of string, the attributes to be deleted
    */
    function delAttribute(obj, prop) {
        obj2 = obj;
        obj = {};
        for (i in obj2) {
            var nf = true;
            for (j = 0; j < prop.length; j++) {
                if (i == prop[j]) { prop.splice(j, 1); nf = false; break; }
            }
            if (nf) obj[i] = obj2[i];
        }
        return obj
    }
    function each(arr, fn) {
        var i = 0, len = arr.length;
        for (; i < len; i++) if (fn.call(arr[i], arr[i], i, arr) === false) return i;
    }


    /* enCode the cell.innerHTML before SQL string generated 
    這段code 要review 將來需要拿掉
    傳rowid 有 '+', or sql 有like 使用到 '%','?' 時 要 encodeURI 
    */
    function encodeHTML(stmp) {
        var ret = stmp.replace(/\x2B/g, "0x002B"); // replace all '+' with 0x002B 這個要拿掉 使用encodeURI (非sql保留字）
        ret = ret.replace(/\x25/g, "0x0025");  // replace all the '%' to 0x0025
        ret = ret.replace(/\x26/g, "0x0026");  // replace all the '&' to 0x0026
        ret = ret.replace(/\x27/g, "0x0027");  // replace all the ' to 0x0027
        ret = ret.replace(/\x22/g, "0x0022");  // replace all the " to 0x0022
        ret = ret.replace(/<BR>/g, "0D0A");    /* safari will change <br> to <BR> */
        return ret.replace(/<br>/g, "0D0A");
    }

    /*+ gFunction.encodeSql(string)
    編碼SQL string 在傳post 給伺服器aspx之前，例如 %, & + 等符號，在伺服器端（aspx）再解碼回來
    encode the sqlstr before executeSqlSyn.aspx for post method issues 
    due to the post method will remove the character like +,%,& 
    end */
    function encodeSql(s) {
        try {
            var s1 = s.replace(/\x2B/g, "0x002B"); // replace all '+' with 0x002B 
            s1 = s1.replace(/\x25/g, "0x0025");  // replace all the '%' to 0x0025
            s1 = s1.replace(/\x26/g, "0x0026");  // replace all the '&' to 0x0026
            return s1;
        }
        catch (e) { // maybe the typeof storeproc is not string
            return s;
        }
    }

    function error(code, stop) {
        var msg = 'jTable error #' + code;
        if (stop) throw msg; else if (window.console) window.console.log(msg);
    }

    function executeSql(o) {
        var errorCode = 400, t = { async: false, data: { storeproc: '' }, url: g_URL + "ajax/executeSQLSyn.aspx",
            success: function (data, textStatus, jqXHR) {
                if (jqXHR.responseXML) errorCode = parseInt(getElementTextNS("", "ERR_NUMBER", jqXHR.responseXML, 0), 10) + 200;
                if (errorCode != 200) {
                    if (jqXHR.responseXML) alert(getElementTextNS("", "ERR_DESCRIPTION", jqXHR.responseXML, 0));
                    else alert(jqXHR.responseText);
                }
                return errorCode;
            } 
        };
        if (typeof (o) == 'object') {
            if (o.url) t.url = o.url;
            extend(t.data, o.data);
            if (o.async) t.async = o.async;
            if (o.success) t.success = o.success;
        }
        else { t.data.storeproc = o; t.url = g_URL + "ajax/executeSQLSyn.aspx"; }
        if (g_debugMode) alert(t.data.storeproc);
        ajax({ url: t.url, data: t.data, async: t.async, dataType: 'xml',
            error: function (jqXHR, textStatus, errorThrown) { alert(textStatus + ':' + errorThrown + '(' + t.data.storeproc + ')'); }, success: t.success
        });
        return errorCode;
    }

    function extend(a, b) {
        var k;
        if (!defined(a)) a = {};
        if (!defined(b)) return a;
        else {
            for (k in b) {
                /* 產生一個新的物件或array，以複製物件否則a[key]=b[key]，只是複製pointer*/
                if (!defined(a[k])) {
                    if (isArray(b[k])) a[k] = new Array();
                    else if (typeof (b[k]) == 'object') {
                        try { a[k] = {}; }
                        catch (err) { }
                    }
                }
                try {
                    a[k] = b[k];
                } catch (err) { }
            }
        }
        return a;
    }

    /**
    * Extend a prototyped class by new members
    * @param {Object} parent
    * @param {Object} members
    */
    function extendClass(parent, members) {
        var object = function () { };
        object.prototype = new parent();
        // copy member attribute to object.prototype
        var n;
        if (!object.prototype) object.prototype = {};
        for (n in members) object.prototype[n] = members[n];
        return object;
    }



    /* fire the mouse click event "MouseEvents" */
    function fireEvent(el, etype, eventArguments, defaultFunction) {
        if (!defined(el)) return false;
        var e
		, detachedType = 'detached' + etype
  	, defaultPrevented
  	, isIE8 = false;

        if (etype == 'MouseEvents' && eventArguments) etype = eventArguments;  /* 舊版本1.1寫法，向下相容把 etype 轉成 eventArgument */
        if (document.createEvent) { /* IE9 and Safari,Chrome */
            e = document.createEvent("MouseEvents");
        } else if (document.createEventObject) {
            try {
                e = document.createEventObject(window.event); /* IE6 will throw error */
                e.button = 1;
            } catch (err) {
                e = document.createEventObject();
                e.button = 1;
            }
            isIE8 = true;
        }

        if (!g_isIE && eventArguments && !isIE8) {
            delete eventArguments.layerX;
            delete eventArguments.layerY;
            //, behaviorPart
        } else if (isIE8 && eventArguments) { /* IE 在設定event 屬性時會有 error 需先刪除 下列屬性*/
            eventArguments = delAttribute(eventArguments, ['behaviorCookie', 'behaviorPart', 'contentOverflow', 'dataTransfer', 'qualifier', 'wheelDelta', 'nextPage', 'srcUrn', 'propertyName']);
        } /* 刪除不支援的 eventArguments */
        if (typeof (eventArguments) == 'object')
            extend(e, eventArguments);

        /* 把 function 存起來？ */
        if (el[etype]) {
            el[detachedType] = el[etype];
            el[etype] = null;
        }
        var i = 0, fn = ['preventDefault', 'stopPropagation'];
        for (; i < 2; i++) {
            var base = e[fn[i]];
            e[fn[i]] = function () { try { base.call(e); } catch (err) { if (fn[i] === 'preventDefault') defaultPrevented = true; } };
        }

        if (isIE8) {
            try {
                el.fireEvent("on" + etype, e);
            } catch (err) {
                if (el['on' + etype]) el['on' + etype](e); /* 如果不是DOM  */
            }
        }  /* not IE8 */else {
            e.initEvent(etype, true, true);
            if ('dispatchEvent' in el) el.dispatchEvent(e);
            else if (el['on' + etype]) el['on' + etype](e); /* Safari- el is not an DOMElement */
        }
        if (defaultFunction && (!defined(e.isDefaultPrevented) || !e.isDefaultPrevented()) && !defaultPrevented) defaultFunction(e);
        if (el[detachedType]) { el[etype] = el[detachedType]; el[detachedType] = null; }
    } /* end of fireEvent */

    function getCookie(c_name) {
        // Sorry! No web storage support..

        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                if (y === null) return "";
                else return unescape(y);
            }
        }
        return "";
    }

    function getCookieInt(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                if (y === null) return -1;
                else return parseInt(y, 10); //return unescape(y);
            }
        }
        return -1;
    }
    function getLocalData(c_name) {
        if (typeof (Storage) !== "undefined") return localStorage[c_name];
        else return getCookie(c_name);
    }
    function getData(me, d) { if (me.data) return me.data[d]; else return undefined; }

    function getElementTextNS(prefix, local, parentElem, index) {
        var result = "";
        if (prefix && g_isIE) result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
        else result = parentElem.getElementsByTagName(local)[index];
        if (!g_isIE && result === null) return "nbsp";
        else if (result) {  //result = "" and null  are different in Safari
            if (result.childNodes.length > 1) return result.childNodes[1].nodeValue;
            else if (result.childNodes.length == 1) return result.firstChild.nodeValue;
            else return "nbsp";
        }
        else if (result === "") return "nbsp";
        else return "n/a";
    }

    function getScrollbarW() {
        if (window.navigator.appName.substr(0, 1) == 'M') { //icrosoft') 
            return 17;
            /*		var div = document.createElement('DIV');
            div.style.width='50px'; div.style.height='50px';
            div.style.overflow='hidden';
            div.style.position='absolute';div.style.top='-200px';
            div.style.left='-200px';
            div.appendChild(document.createElement('DIV'));
            div.firstChild.style.height='100px';
            document.body.appendChild(div); 
            var w1 = div.clientWidth; //('div', div).innerWidth(); 
            div.style.overflowY='auto';  
            var w2 = div.clientWidth;  //('div', div).innerWidth(); 
            document.body.removeChild(div); 
            return (w1-w2); */
        } else return 0;
    }

    function isArray(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; }
    function isNumber(n) { return typeof n === 'number'; }
    function isString(s) { return typeof s === 'string'; }
    function isObject(obj) { return typeof obj === 'object'; }
    /* 
    f (boolean) : true lock the ajax call, false unlock
    elm (HTMLElement) : the cursor of the element
    sl(boolean) : show or hide the loading image in the middle of elm   
    counter: the number of locked by ajax calls, default is one 
    */
    function lockAjax(f, elm, sl, xmlHdr, counter) {
        /* check if locked by other then return false */
        if (!defined(counter)) counter = 1;
        if (f && defined(document.body.lockedBy)) {
            if (xmlHdr) {
                xmlHdr.abort();
                lockAjax(false, document.body.lockedBy, false);
            }
            else return false;
        }
        /* do lock */
        if (f && defined(elm)) {
            document.body.style.cursor = 'wait';
            elm.lockCounter = counter;
            //elm.style.cursor='wait';
            document.body.lockedBy = elm;
            if (defined(sl)) showLoading.apply(elm, [sl]);
            return true;
        } else if (f == false) { /* unlock */
            var slElm = pick(elm, document.body.lockedBy);
            if (defined(slElm, 'lockCounter') && slElm.lockCounter >= 2) {
                slElm.lockCounter--;
            } else {
                document.body.style.cursor = 'default';
                if (sl == false && slElm) showLoading.apply(slElm, [sl]);
                document.body.lockedBy = null;
                return false;
            }
        }
    }
    /**
    * Deep merge two objects and return a third object
    */
    function merge() {
        var args = arguments;
        var ret = null;
        for (var i = 0; i < args.length; i++) ret = deepExtend(ret, args[i]);
        return ret; //, args[1], args[2], args[3]);
    }
    // for merge 物件包含物件，多層的複製 v.s. extend 單層複製
    function deepExtend(a, b) {
        if (!defined(a)) a = {};
        for (key in b) {
            /* 產生一個新的物件或array，以複製物件否則a[key]=b[key]，只是複製pointer*/
            if (!defined(a[key])) {
                if (isArray(b[key])) a[key] = new Array();
                else if (typeof (b[key]) == 'object') a[key] = {};
            }
            if (typeof (b[key]) == 'object' && defined(b[key]) && !defined(b[key].tagName)) { /* baseURI: html 物件直接複製,否則stack overflow */
                if (typeof (a[key]) == 'string') a[key] = deepExtend({}, b[key]);
                else a[key] = deepExtend(a[key], b[key]);
            }
            else a[key] = b[key];
        }
        return a;
    }
    /**
    * called at normalized
    * Get the position of an element relative to the top left of the page
    * 有一些些失誤
    * jiantian 2012/08 offsetTop 是相對於offsetParent的距離，所以要往上找parentNode until document.body
    offsetLeft, offsetTop 
    */
    function offset(el) {
        if (!defined(el)) return { top: 0, left: 0 };
        else {
            var pn = el.offsetParent, p = offset(pn);
            var sl = 0, st = 0;
            if (pn && defined(pn.scrollLeft)) {
                sl = pn.scrollLeft; st = pn.scrollTop;
            }
            return { top: el.offsetTop + p.top - st, left: el.offsetLeft + p.left - sl };
        }
    }



    /* Return the first value that is defined.*/
    function pick() {
        var args = arguments, i = 0, arg, l = args.length;
        for (; i < l; i++) { arg = args[i]; if (typeof arg !== 'undefined' && arg !== null) return arg; } 
    }

    function removeEvent(el, e, fn) {
        if ('removeEventListener' in el) el.removeEventListener(e, fn, false); //W3
        else if ('detachEvent' in el) {
            try {
                el.detachEvent('on' + e, fn); //IE
            } catch (ex) {
                //jiantian IE8 Error here ('err removeEvent');
            }
        }
        else el['on' + e] = null;
    }

    // 表頭欄位寬度調整
    function resizeCell(cIdx, jTbl) {
        var c = this;
        var tc = c.nextSibling;
        if (!tc) return;
        tc.offLeft = offset(tc).left;

        tc.hMove = function () {
            var e = event, c = e.srcElement, d = e.clientX - c.offLeft;
            if (!defined(c.cxy)) c.cxy = { x: e.clientX, y: e.clientY };
            var dM = e.clientX - c.cxy.x;
            c.cxy.x = e.clientX;
            if (dM == 0) return;
            else if (d < 10) {
                if (dM > 0) c.style.cursor = 'e-resize';
                else c.style.cursor = 'w-resize';
            } else if (c.offsetWidth - d > 10) {
                c.style.cursor = 'default';
                removeEvent(c, 'mousemove', c.hMove);
            }

        };
        tc.hDrag = function () {
            var e = event, c = e.srcElement;
            var tbl = c.parentNode.parentNode.parentNode;
            var dX = (e.clientX - c.cxy.x);
            var w, r = tbl.tHead.firstChild;
            var cID = (e.clientX - c.offLeft < 10) ? cIdx : cIdx + c.colSpan;


            w = r.childNodes[cID].style.width.toInt();

            if (defined(jTbl)) {
                jTbl.setColWidth.apply(jTbl, [cID, w + dX]);
            } else {
                r.childNodes[cID].style.width = (w + dX) + 'px';
                tbl.style.width = (tbl.style.width.toInt() + dX) + 'px';
            }
            c.cxy.x = e.clientX;
            c.offLeft += dX;
        }
        tc.hDragEnd = function () {
            var e = event, c = e.srcElement;
            var tbl = c.parentNode.parentNode.parentNode;

            c.style.cursor = 'default';
            removeEvent(c, 'mousemove', c.hDrag);
            var s = '';

            for (c = tbl.tHead.childNodes[1].firstChild; c; c = c.nextSibling) s += ',' + c.offsetWidth;
            setCookie('colsWidth' + tbl.id, s.substr(1), 20);

        };
        // if mouse move in from the left size, addEvent movemove
        // and remove it when move over 10px (not clicked)
        tc.onmouseover = function () {
            var c = this, e = event;
            c.cxy = { x: e.clientX, y: e.clientY };
            if (e.clientX - c.offLeft > 10) {
                if (c.offLeft + c.offsetWidth - e.clientX < 10 && c.nextSibling) {
                    c.style.cursor = 'w-resize';
                    addEvent(c, 'mousemove', c.hMove);
                }
                else return;
            }
            else {
                c.style.cursor = 'e-resize';
                addEvent(c, 'mousemove', c.hMove);
            }
        }
        // remove the onmouse move event handler
        tc.onmouseout = function () {
            var c = this;
            c.style.cursor = 'default';
            removeEvent(c, 'mousemove', c.hMove);
        }
        // if clicked and in the left border zone (0~10 px) then start resize 
        tc.onmousedown = function () {
            var c = this, e = event;
            var dX = e.clientX - c.offLeft;
            if (dX < 10 || (c.offsetWidth - dX) < 10) {
                c.cxy = { x: e.clientX, y: e.clientY };
                removeEvent(c, 'mousemove', c.hMove);
                addEvent(c, 'mousemove', c.hDrag);
                addEvent(c, 'mouseup', c.hDragEnd);
                addEvent(c, 'mouseout', c.hDragEnd);
            }

        }
    }
    //authentication
    function setAuth(d) {
        var a = g_auth[d.dbSID];
        if (a) {
            if (a.pwd === undefined) {
                if (a.isADSO) a.pwd = window.prompt("your password", "xxx");
                else {
                    var uid = getLocalData(d.dbSID + "UID");
                    if (uid == "" || uid === undefined) uid = "guest/guest";
                    var s = uid; //window.prompt("input your username and password",uid);
                    var i = s.search('/');
                    if (i >= 0) {
                        a.pwd = s.substr(i + 1); a.uid = s.substr(0, i);
                        try {
                            localStorage.EDWR13UID = s;
                        }
                        catch (e) { setCookie("EDWR13UID", s, 30); }
                    }
                    else alert("error");
                }
            }
            if (!a.isADSO && a.uid) d.USERNAME = a.uid;
            d.PASSWORD = a.pwd;
        }
        else return "";
    }


    function setCookie(x, y, eDays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + eDays);
        document.cookie = x + "=" + escape(y) + ';expires=' + exdate.toUTCString();
    }
    function setData(me, d, v) { if (!me.data) me.data = {}; me.data[d] = v; }

    function setLocalData(c_name, val, eDays) {
        if (!defined(eDays)) eDays = 7;
        if (typeof (Storage) !== "undefined") localStorage[c_name] = val;
        else setCookie(c_name, val, eDays);

    }


    /*+ 
    show or hide waiting image at the middle 
    +*/
    function showLoading(flg) {
        var divWait,
		tabPanel = this;
        if (flg == false) {
            divWait = tabPanel.divLoading;
            if (divWait && divWait.parentNode) {
                try {
                    divWait.parentNode.removeChild(divWait);
                } catch (e) { };
            }
            delete divWait;
            tabPanel.divLoading = null;
        }
        else {
            var off = offset(tabPanel);
            tabPanel.divLoading = appendChild(document.body, { tag: 'DIV', className: 'loadingApple' });
            tabPanel.divLoading.style.left = (off.left + Math.round(tabPanel.offsetWidth / 2 - 8)) + 'px';
            tabPanel.divLoading.style.top = (off.top + Math.round(tabPanel.offsetHeight / 2 - 8)) + 'px';
        }
    }
    function winHeight() {
        //var winH=DOC.body.offsetHeight;
        if (DOC.body && DOC.body.offsetHeight) return DOC.body.offsetHeight;
        else if (DOC.documentElement && DOC.documentElement.offsetHeight) return DOC.documentElement.offsetHeight;
        else if (WIN.innerHeight) return WIN.innerHeight;
    }
    function winWidth() {
        if (DOC.body && DOC.body.offsetWidth) return DOC.body.offsetWidth;
        else if (DOC.documentElement && DOC.documentElement.offsetWidth) return DOC.documentElement.offsetWidth;
        else if (WIN.innerWidth) return WIN.innerWidth;
    }
    /* 
    bug ：
    1.誤植cloneHR, crossTab: 
    2. 誤植 crosstab CT.measure需修正成CT.measures
    var 1.6 2013/3 
    1. bug fix for tree node layer to 4 = sumCol and groupRows function
    class TreeCell TNCell were conbined and changed class_JT1TL png file
    2. tree node add data {layer, nxsb, pvsb (previous sibling), childNum} for 
    3. bug fix for scrollBody -- when colSpan(第一行合併儲存格）則複製tHead. hidden row 
    4. crossTab 增加sort參數sort:{adFlag:[] ...}
    5. sumCol 增加bFlag = function(o) ...可以指定summary row 的function
    ver 1.4.s 2012/12
    1. 新增jTable.scrollBody(2維，凍結儲存格）
    2. 新增 sort by column (header可以sort, createHeader時)
    3. HTMLSectionElement.tbody = jTbody object
    4. 修改 groupRows (bug fix)
    4.1 最左邊 borderLeft=''
    ver 1.4 2012/10/10
    1. 修改object.extend (for IE6+)
    2. jTable.scrollBody (style.position=absolute from IE6+)
    3. 修改fireEvent (for IE6+)
    ver 1.0 2011/11/14 feature : 
    1. tBody.loadJSONtoRows({async:boolean}) : with parameter 'async':false for sycronouse ajax
    2. remove loadXML function (replaced by loadJSONtoRows) 
    ver 1.0.1 2011/12 
    1. auto adjust column width, and align width with body (when scrollable)
    ver 1.0.2 2012/2
    1. remove loadGrid, implement functions 
    ver 1.1.0 2012/3/27 
    bug fixed and mondification
    1. conbine loadGrid.js and globalVer.js
    2. insertRow add cellClass setting
    3. createRowText (replace by insertRow)
    4. setColsStyle
    5. scrollTable
    new feature:
    1.sort and insSort
    2. groupRows
    3. crossTab
    4. sumRow 
    */
    // =========== update history ===========
    // Any modification or new feature please comment here
    // v0 : by Jiantian 2011/09/26
    // load data into a html table with id (default ==
    // 0910 modify addMonth(m,i)
    // =========== end of history ===========
    if (WIN.location.host.search("cmipad") >= 0) WIN.g_URL = "/infoMon/";
    else WIN.g_URL = "/";
    /* if true will show every return message from ajax */
    var g_debugMode = false
	, g_debugCounter = 10;
    var gc_showDetail = -101;
    var gc_edInput = 1;   // editable column with input box (single-line) 
    /* if double click the column, will change the cell and background color */
    /* 5 ~9 reserved */
    var gc_edInteger = 2
	, gc_edPInteger = 3
	, gc_edTextArea = 9; // editable column with textarea (multi-line)

    /* 10 ~19 reserved */
    var gc_edSelF = 10,  // sel from 
	gc_edSelT = 19;  // sel to 
    /* 30 ~49 reserved for auto complete */
    var gc_edAC = 30, /* auto complete 2012/04/10 */
	gc_edDP = 48, // date picker change from 8 to 48,
	gc_edACP = 46, // editable column with autoComple for peopleSearch
	gc_edDblclk = 57, //rotate value (run robbin) by double click
 	gc_edAutoSum = 58;  // global constant- editable column with input box and call SumGrid...autoSum the next 1 column

    var gc_maxRowNo = 5000;
    /* set the row can be delete when click the column (3 state switch) */
    var gc_edDeleteRow = 100;

    // the bellow declaretion is for meetingminutes.aspx, you should re-assign the g_edflag value in your local file
    // and will be replaced by tbody.edFlag
    var g_edFlag = new Array(0, 3, 10, 3, 3, 1, 1, 11, 12, 1, 0, 1, 0, 1, 1, 1, 1, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var g_options = new Array();
    /* must set the column name in your local aspx file */
    var g_colsName = new Array();
    var g_tblName = "";
    var g_iBox = null; /*  input box (for ajax call back global variable) the global var for jQuery UI hidden variable */
    var g_isIE = true;  /* check if client web browser is IE5 or IE6 detected by ? */
    /*  your may update this variable at ajax aspx with request.serverVariable("LOGON_USER") */
    var g_logonUser = "anonymous";
    /* default table body attributes */
    var cMinPageNo = -9999 /* constant minimum delta page number of tBody for toolbar firstPage and Lastpage */
	, cMaxPageNo = 9999
	, g_auth = { edwr13: { isADSO: false} };

    var jFun = {};
    var jInfo = {};
    jInfo.objName = { TBODY: 'iTbody', TABLE: 'iTable', TFOOT: 'iTbody', THEAD: 'iTbody'
    };
    jInfo.isIE = (window.navigator.appName.substr(0, 1) == 'M');
    jInfo.sbWidth = (jInfo.isIE) ? 17 : 0;
    jInfo.clsName = {
        hdSortable: 'sortable' /* sortable header cell */
	, hdSortedA: 'sortedA'
	, hdSortedD: 'sortedD'
	, defHeader: 'GMCellHeader' /* default header cell */
	, defHidden: 'JTHiddenRow'
	, sRow: 'JTNodeRow0'
	, oRow: 'JTDataRow1' /* default data row odd row */
	, eRow: 'JTDataRow2' /* default data row even row */
	, tbPager: 'GMToolPager' /* toolbar pager  */
	, tbExport: 'GMToolExport'
	, treeRow: 'TNRow'
	, treeCell: 'TNCell' //'JTreeCell'
	, treeNode: 'TreeNode' /* leaf node */
	, treeLeaf: 'JT1TL'   /* lead node icon  such as L */
	, tree1T: 'JT1T'
	, tree1: 'JT1'
	, treeEmp: 'JT0'
	, treeC: 'JTE'  /*  +  collapsed icon */
	, treeE: 'JTC'  /* - expended icon */
	, wrapper: 'JTWrapper'
	, btnBack: 'JTBBack'
	, cellUpdated: 'cellUpdated'
    };
    jInfo.errDesc = {
        IE404: 'cannot open the file,please update the browser (IE) security setting'
    };
    jInfo.color = {}
    jInfo.url = {
        peopleSearch: 'http://tnvcmipad.cminl.oa/infoMon/ajax/peopleSearch.aspx'
  , home: 'http://tnvcmipad.cminl.oa/infoMon/'
    }
    jInfo.color.treeNode = (jInfo.isIE) ?
	['#E5F5FF', '#E5FFF5', '#F5FFE5', '#E5FFF5', '#E5FFF5', '#E5FFFF'] :
	['rgba(215,245,255,1)', 'rgba(215,255,245,0.8)', 'rgba(245,255,215,0.6)', 'rgba(215,255,245,0.5)', 'rgba(215,255,245,0.2)', 'rgba(215,255,245,0.2)']; //'#E5FFF5'
    jInfo.getObj = function (me, s) {
        var TAG = s.toUpperCase();
        for (var p = me; p; p = p.parentNode) if (p.data && p.data[jInfo.objName[TAG]]) return p.data[jInfo.objName[TAG]];
        return undefined;
    }

    //authentication
    function setAuth(data) {
        var a = g_auth[data.dbSID];
        if (a) {
            if (a.pwd === undefined) {
                if (a.isADSO) a.pwd = window.prompt("your password", "xxx");
                else {
                    //if (
                    var uid = getLocalData(data.dbSID + "UID");
                    if (uid == "" || uid === undefined) uid = "guest/guest";
                    var s = uid; //window.prompt("input your username and password",uid);
                    var i = s.search('/');
                    if (i >= 0) {
                        a.pwd = s.substr(i + 1); a.uid = s.substr(0, i);
                        try {
                            localStorage.EDWR13UID = s;
                        }
                        catch (e) { setCookie("EDWR13UID", s, 30); }
                    }
                    else alert("error");
                }
            }
            if (!a.isADSO && a.uid) data.USERNAME = a.uid;
            data.PASSWORD = a.pwd;
        }
        else return "";
    }


    function colStr(c, pre) {
        if (c.length == 0) return ""; var s = c[0]; for (var i = 1; i < c.length; i++) s += "," + c[i];
        if (pre.length > 0 && s.length > 0) return (pre + s); else return s;
    }


    /* search starting from child c and find the next matched(funcion return with true value)  child */
    function getNextElement(c, f) { var o = { c: c }; while (o.c && !f(o)) o.c = o.c.nextSibling; return o.c; }
    function getElement(me, o) {
        var i = -1, e = null;
        if (o.by == 'innerHTML') {
            while (++i < me.childNodes.length) if (me.childNodes[i].innerHTML == o.v) {
                e = me.childNodes[i]; break;
            } 
        }
        else if (o.by == 'className') {
            while (++i < me.childNodes.length) if (me.childNodes[i].className == o.v) {
                e = me.childNodes[i]; break;
            } 
        }
        if (e !== null && o.f) o.f(e);
        return e;
    }
    function getElements(me, o) {
        var i = -1, e = [];
        if (o.by == 'innerHTML') { while (++i < me.childNodes.length) if (me.childNodes[i].innerHTML == o.v) e.push(me.childNodes[i]); }
        else if (o.by == 'className') { while (++i < me.childNodes.length) if (me.childNodes[i].className == o.v) e.push(me.childNodes[i]); }
        else if (o.by == 'tagName') return me.getElementsByTagName(o.v);
        return e;
    }
    /* insSort 跟crossTab 用到 */
    function getElementValue(me, idx) {
        if (typeof (idx) == 'string') { var i = parseInt(idx, 10); return (isNaN(i) || i > me.childNodes.length) ? getData(me, idx) : me.childNodes[i].innerText; }
        else try { return me.childNodes[idx].innerText; }
        catch (e) { return null; }

    }
    jFun.getPN = function () {
        var pr, r = this;
        for (pr = r.previousSibling; pr; pr = pr.previousSibling) if (pr.data.layer == r.data.layer - 1) break;
        return pr;
    }
    function setCollapse(r) {
        if (r === null) return;
        var s = r.className;
        var l = s.length;
        if (l <= 2 || ((s.substr(0, 2) != 'GM') && (s.substr(0, 2) != 'JT'))) return;
        if (s.substr(l - 1, 1) == 'L') { if (s.substr(l - 2, 1) == 'C') r.className = s.substr(0, l - 2) + 'EL'; }
        else if (s.substr(l - 1, 1) == 'C') r.className = s.substr(0, l - 1) + 'E';
    }
    function setData(me, d, v) { if (!me.data) me.data = {}; me.data[d] = v; }

    /*+ parserIdx gFunction.setStyle(HTMLCellElement,object) 
    set the cell(c) to style(o), setStyle(c,{textAlign:'left',display:'none',toFixed:3}
    c (HTMLCellElement) : the cell to be apply with style
    o.textAling(string): options ('left','right','center')
    o.toFixed (integer): round integer
    o.edFlag (integer) : set the onclick event to td_onclick
    parserEnd */

    function setStyle(c, o) {
        if (!c) return;
        else if (!c.style) return; //c.style= new Array();
        var t = extend({ textAlign: 'center', toFixed: -1 }, o);
        if (t.textAlign) c.style.textAlign = t.textAlign;
        if (t.color) c.style.color = t.color;
        if (t.display) c.style.display = t.display;
        if (t.toFixed >= 0) {
            if (t.div) c.innerHTML = addCommas(c.innerHTML.toFloat() / t.div, t.toFixed);
            else c.innerHTML = addCommas(c.innerHTML.toFloat(), t.toFixed);

        }
        if (t.edFlag) c.onclick = td_onclick;
        if (t.className) c.className = t.className;
    }

    /*+ gFunction.slide(0) 
    trigger by timer (element.show only) */
    function slide(o) {
        var h = isNaN(parseInt(o.obj.style.height, 10)) ? 0 : parseInt(o.obj.style.height, 10);
        var tcy = (h + o.deltaY < 0) ? 0 : h + o.deltaY;
        o.obj.style.height = tcy + "px";
        if (o.deltaY * (o.height - tcy) <= 0) {
            window.clearInterval(o.obj.data.interval);
            o.obj.style.display = o.display; o.obj.data.interval = null;
            if (o.f) o.f(o.obj);
        } 
    }

    function showElement(me, o) {
        if (!defined(me.data)) me.data = new Array();
        if (!me.data.interval) {
            o.obj = me;
            var msec = o.msec;
            var y = (me.style.height) ? parseInt(me.style.height, 10) : 0;
            if (isNaN(y) || o.display == '') y = parseInt(me.offsetHeight, 10);
            if (isNaN(y)) y = 200;
            if (o.display == 'none') { /* hide the element */
                me.style.height = y + 'px';
                o.deltaY = -1 * Math.round(y / 10);
                o.height = 0;
                msec = Math.round(msec / 10);
            }
            else { /* show the element */
                me.style.display = '';
                me.style.height = '0px';
                o.deltaY = 1 * Math.round(y / 10);
                o.height = y;
                msec = Math.round(msec / 10);
            }
            me.data.interval = window.setInterval(function () { slide(o); }, msec);
        }
    }



    /* 
    this function and slideBackgroundImgeX only called at meetingminutes; consider move to main.js 
    2013/03 jian created a common animate function to replace slideBackgroundImage
    anim.tgt: target value,
    .delta (every time moved), step: the steps of move 
    .interval
    .val
    */

    function td_deleteRow(thisobj) {
        writeBack();
        if (thisobj.className) {
            var nextNode = thisobj.nextSibling;
            if (thisobj.className == "tobeDelete") {
                thisobj.className = "delConfirm";

                // show the delete button, and set the onclick event to deleterow
                nextNode.onclick = function () { td_deleteRow(this); }
                nextNode.className = "cellButtonDelete";
                nextNode.style.backgroundPositionX = "-170px";
                nextNode.style.backgroundPositionY = "bottom";
                if (g_int !== null) window.clearInterval(g_int);
                g_int = window.setInterval(function () { slideBackgroundImageX(nextNode, 6, 0); }, 10);
            }
            else if (thisobj.className == "delConfirm") {
                thisobj.className = "tobeDelete";
                if (g_edFlag[nextNode.cellIndex] > 0) nextNode.onclick = td_onclick;
                //nextNode.className=null;//style.background=null; //"url(Styles/delete32.png) no-repeat bottom left";
                if (nextNode.className !== null) {
                    if (g_int !== null) window.clearInterval(g_int);
                    g_int = window.setInterval(function () { slideBackgroundImageX(nextNode, -6, -170); }, 10);
                }
            }
            else if (thisobj.className == "cellButtonDelete") {
                deleteRow(thisobj.parentNode);
            }
        }
        else thisobj.className = "tobeDelete";
    }

    /*+ parserIdx gFunction.td_onclick()
    the onclick function when table cell been click
    writeback the input box content to previous cell, and show the input box on the current position (cell) 
    parserEnd */
    function td_onclick() {
        writeBack(); // wirte back before creat textarea to new cell
        var cellText, elm = this, i;
        var l_text = elm.innerHTML, cstyle, edFlag = 0, divAC = null, selectOptions;
        if (elm.tagName == 'TD') {
            var tb = getData(elm.parentNode.parentNode, 'iTbody');
            if (tb !== null) {
                if (elm.data && elm.data.edFlag) edFlag = elm.data.edFlag;
                else edFlag = tb.edFlag[elm.cellIndex];
                if (tb.selectOptions) selectOptions = tb.selectOptions;
            }
            else {
                edFlag = g_edFlag[elm.cellIndex];
                selectOptions = g_options;
            }
            cstyle = tb.getColStyle(elm.cellIndex);
        }
        else edFlag = g_edFlag[elm.cellIndex];

        /*if (this.id != null && this.id != "") edFlag=parseInt(this.id.substr(this.id.length-2,2));
        else  remove by jian 2011/11 ver 1.0 這部份需要修改，原來設計只有一個
        g_edFlag，但後來一報表可能有多個table body需要編輯，故改為各table body內也有個變數叫 jTbody.edFlag[] */
        if (edFlag < gc_edTextArea) { /* auto sum for checklist should been conbine to onkeyup */
            cellText = document.createElement("INPUT");
            cellText.onkeyup = inputBox_onkeyup;
            if (edFlag >= gc_edInteger) cellText.onkeydown = inputBox_onkeydown;
            if (l_text != null) cellText.value = l_text;
            cellText.onblur = writeBack;
        }
        else if (edFlag == gc_edTextArea) {
            cellText = document.createElement("textarea");
            cellText.style.width = '100%';
            cellText.style.boxSizing = 'border-box';
            if (l_text != null) {
                l_text = l_text.replace(/<BR>/g, "\n");  /* IE will replace the <br> tag to <BR>, but safari dosen't */
                cellText.value = l_text.replace(/<br>/g, "\n");
            }
            cellText.onblur = writeBack;
        }
        else if (edFlag <= gc_edSelT) {
            cellText = document.createElement("SELECT");
            cellText.onblur = writeBack;
            for (var i = 0; i < selectOptions[edFlag - gc_edSelF].length; i++) {
                var option = document.createElement("option");
                option.text = selectOptions[edFlag - gc_edSelF][i];
                try { // for IE earlier than version 8
                    cellText.add(option, cellText.options[null]);
                }
                catch (e) { cellText.add(option, null); } 
            }
            var selected = setSelectedByText(cellText, l_text, 0, l_text.length);
            if (selected < 0 || l_text.length == 0) {
                cellText.className = 'cellUpdated';
            }
        }
        else if (edFlag >= gc_edAC && edFlag < gc_edAC + 10) { /* 2012/04/10 autocomplete */
            divAC = document.createElement('DIV');
            cellText = appendChild(divAC, { tag: 'INPUT', onkeyup: inputBox_onkeyup,
                onclick: function () { this.nextSibling.style.display = ''; } 
            });
            if (elm.className == jInfo.clsName.cellUpdated) cellText.className = jInfo.clsName.cellUpdated;
            if (l_text != null) cellText.value = l_text;
            var sel = appendChild(divAC, { tag: 'UL' });
            for (var i = 0; i < selectOptions[edFlag - gc_edAC].length; i++) {
                var li;
                var j = selectOptions[edFlag - gc_edAC][i].search('0D0A');
                if (j > 0) {
                    li = appendChild(sel, { tag: 'LI',
                        onmouseover: ACLI_mouseEventHandler,
                        onclick: ACLI_mouseEventHandler,
                        innerHTML: selectOptions[edFlag - gc_edAC][i].replace('0D0A', '<br>'),
                        style: 'height:38px;'
                    }); /* option to LI */
                }
                else {
                    li = appendChild(sel, { tag: 'LI',
                        onmouseover: ACLI_mouseEventHandler,
                        onclick: ACLI_mouseEventHandler,
                        style: 'height:20px;',
                        innerHTML: selectOptions[edFlag - gc_edAC][i]
                    }); /* option to LI */
                }
            }
        }
        else if (edFlag == gc_edDP) {
            var d = new jDatePicker({ parentNode: elm, format: (cstyle) ? cstyle.format : 'mm/dd' });
            divAC = d.divObj;
            cellText = divAC.firstChild;
        }
        else if (edFlag == gc_edACP) { //目前只有meeting minutes使用，計畫取消此類別因此類別需要jQueryUI，改用gc_edAC
            var acp = new jAC({ elm: elm });
            //g_iBox = document.getElementById("divBirds"); 
            //g_iBox.style.visibility="visible";
            //if (l_text !== null) { g_iBox.childNodes[0].value = l_text;   g_iBox.childNodes[1].value = l_text;}
            //elm.onclick=null;
            // elm.inp.focus();
            //g_iBox.childNodes[0].focus();
            //g_iBox.childNodes[0].onchange=inputBox_onchange;        

            return;
        }
        else if (cellText.value == "0" && edFlag == gc_edAutoSum) { // auto sum     
            cellText.className = jInfo.clsName.cellUpdated;
            cellText.value = l_sumColumns(elm.parentNode.parentNode, elm.parentNode.sectionRowIndex);
        }
        else {
            cellText = document.createElement("input");
            cellText.onkeyup = inputBox_onkeyup;
            if (l_text != null) cellText.value = l_text; //.replace(/<BR>/g,"\n"); //this.childNodes[0].data;
        }
        cellText.id = "inputBox";  /* set id for move to other cellText.focus();   */
        cellText.onchange = inputBox_onchange;
        setData(cellText, 'edFlag', edFlag);
        if (elm.className == jInfo.clsName.cellUpdated) { // 呼叫之前(td_onclick)此cell 已經被修改過
            setData(cellText, 'before', getData(elm, 'before'));
            cellText.className = jInfo.clsName.cellUpdated;
        }
        else setData(cellText, 'before', l_text);


        if (divAC === null) {
            elm.innerHTML = "";
            cellText.style.width = "100%";
            cellText.style.height = "100%";
            elm.appendChild(cellText);
        }
        else if (divAC.parentNode != elm) { // datepicker excluded
            cellText.style.width = elm.parentNode.parentNode.parentNode.tHead.firstChild.childNodes[elm.cellIndex].style.width;
            elm.innerText = '';
            divAC.className = 'JTACPDiv';
            elm.appendChild(divAC);
        }
        cellText.focus();
        if (cellText.tagName == "INPUT") cellText.select();
        elm.onclick = null;
    }

    /*+ gFunction.td_showDetail()
    必須先設定 tBody.detailPost 
    detailPost.url : 必填，return HTML
    detailPost.data(object): this object will post to ajax 
    detailPost.param[integer…]: 要傳給 url 的參數，讀取該row第 n 個innerHTML
    detailPost.paramName[string…] : 上述參數的欄位名稱,若沒設定 會自動以param0..paramn命名
    parserEnd */
    function td_showDetail_post(bd, pr) {
        var p = extend({ dbSID: 'sdb2' }, bd.detailPost.data);
        for (var i = 0; i < Math.min(pr.childNodes.length, bd.detailPost.param.length); i++) {
            var s = (bd.detailPost.paramName.length > i) ? bd.detailPost.paramName[i] : 'param' + i;
            p[s] = pr.childNodes[bd.detailPost.param[i]].innerHTML;
        }
        return p;
    }
    /* show deail 
    當要特別處理時請copy 到local 修改*/
    function td_showDetail() {
        var pr = this.parentNode;
        var bd = getData(pr.parentNode, 'iTbody');
        if (bd === undefined || bd.detailPost === undefined) return;
        var del = document.getElementById('detailRow');
        if (del !== null && del !== undefined) { /* if exist then remove it */
            var rtmp = del.previousSibling;
            bd.tBody.removeChild(del);
            if (rtmp == pr) return; /* if click the same row twice then remove detail and do nothing */
        }
        writeBack();

        var p = td_showDetail_post(bd, pr);
        var delRow = appendChild(pr.parentNode, { insBefore: pr.nextSibling, tag: 'TR', style: 'display:none', id: 'detailRow' });
        appendChild(delRow, { tag: 'TD', colSpan: this.parentNode.childNodes.length });
        ajax({ url: bd.detailPost.url, data: p, async: true, dataType: 'html',
            error: function (jqXHR, textStatus, errorThrown) {
                var r = document.getElementById('detailRow');
                if (r !== null) r.firstChild.innerHTML = textStatus;
            },
            success: function (data, textStatus, jqXHR) {
                var r = document.getElementById('detailRow');
                if (r !== null) r.firstChild.innerHTML = decodeHTML(data);
                r.style.display = '';
            } 
        });
    }
    /* event gFunction.toolbarClick()
    */
    function toolbarClick() {
        var elm = this, tbl = elm.parentNode.parentNode.parentNode.tbody.parentNode // getData(this,'tb'); /* get itable object */
		, state = pick(elm.state, false);

        if (tbl.tBodies.legnth == 0 || tbl.tBodies[0].rows.length == 0) return;
        var tbody = tbl.tBodies[0], i, r;
        elm.state = !state; //	var state = !(getData(this,'state')); setData(this,'state',state);
        if (elm.className.substr(6, 5) == 'Pager') {
            var rpg = pick(tbl.rowsPerPage, tbody.rowsPerPage),
			rc = pick(tbl.rowCount, tbody.rows.length);
            var l = Math.min(rpg * (tbody.curPage + 1), tbody.rows.length);

            for (i = (tbody.curPage * rpg); i < l; i++) {
                tbody.tBody.rows[i].style.display = 'none';
            }
            tbody.curPage = Math.min(Math.max(0, tbody.curPage + pick(elm.data, 1)), cMaxPageNo, Math.round(rc / rpg) + 1);
            l = Math.min((rpg) * (tbody.curPage + 1), rc);

            for (i = (tbody.curPage * tbody.rowsPerPage); i < l; i++) { tbody.tBody.rows[i].style.display = ''; }
            tbl.setToolBar({ set: 'pager', fromRow: tbody.curPage * rpg + 1, toRow: l, rowCount: rc });
            if (rc <= l) {
                getElement(elm.parentNode, { by: 'className', v: 'GMToolPagerNext1', f: function (t) { t.disabled = true; t.className = 'GMToolPagerNext'; } });
                getElement(elm.parentNode, { by: 'className', v: 'GMToolPagerLast', f: function (t) { t.disabled = true; } });
            }
            else {
                getElement(elm.parentNode, { by: 'calssName', v: 'GMToolPagerNext', f: function (n) { n.disabled = false; n.className = 'GMToolPagerNext1'; } });
                getElement(elm.parentNode, { by: 'calssName', v: 'GMToolPagerLast', f: function (n) { n.disabled = false; } });
            }
            if (tbody.curPage > 0) getElement(elm.parentNode, { by: 'className', v: 'GMToolPagerPrev', f: function (t) { t.disabled = false; t.className = 'GMToolPagerPrev1'; } });
            else getElement(elm.parentNode, { by: 'className', v: 'GMToolPagerPrev1', f: function (t) { t.disabled = true; t.className = 'GMToolPagerPrev'; } });
        }
    }



    /*+ upserCol(object)
    update or insert columns 
    o.r (HTMLRow)
    o.cidx (integer): start column index
    o.val ([integer]): value to be updated  */
    function upserCol(t) {
        var i;
        for (i = t.r.childNodes.length; i < (t.maxCol); i++) appendChild(t.r, { tag: 'TD', innerHTML: '0' });
        if (t.yType == 'sum') { /* accu */
            for (i = 0; i < t.val.length; i++) {
                if (t.cidx + i < t.r.childNodes.length) t.r.childNodes[t.cidx + i].innerHTML = String(t.r.childNodes[t.cidx + i]).toInt() + parseInt(t.val[i], 10);
                else t.r.childNodes[t.cidx + i].innerHTML = parseInt(t.val[i], 10);
            } 
        }
        else for (i = 0; i < t.val.length && (t.cidx + i) < t.maxCol; i++) t.r.childNodes[t.cidx + i].innerText = String(t.val[i]);
        /* over write origenal */
    }
    /*+ gFunction.writeBack()
    如果有修改，把input box的值寫回去table cell,以及設定className='cellUpdated'
    很多地方都會call不要寫得太複雜
    called by td_onclick, on_save, wirte back the input box to table cell */
    function writeBack() {

        var iBox = document.getElementById("inputBox");
        var c, i;
        if (iBox != null) {
            var beforeUpdated = getData(iBox, 'before');
            var txt = "";
            if (iBox.nodeName == "TEXTAREA" || iBox.nodeName == "INPUT") {
                txt = iBox.value.replace(/\n/g, "<br>");
                txt = txt.replace(/\r/g, "");
            }
            else if (iBox.nodeName == "SELECT") txt = iBox.options[iBox.selectedIndex].text;
            else if (iBox.jAC) {
                iBox.jAC.writeBack();
                return;
            }
            /* 2012/04/10 */
            i = getData(iBox, 'edFlag');
            if (i >= gc_edInteger && i < gc_edInteger + 5) {
                if (isNaN(parseInt(txt, 10))) {
                    if (beforeUpdated) { txt = beforeUpdated; iBox.className = ''; }
                    else txt = '0';
                }
            }
            else if (i >= gc_edAC && i < gc_edAC + 10 || i == gc_edDP) {
                iBox = iBox.parentNode; /* div */
                iBox.className = iBox.firstChild.className;
            }
            c = iBox.parentNode;

            c.className = iBox.className; //"cellUpdated"; 
            c.removeChild(iBox); c.innerHTML = txt; c.onclick = td_onclick;
            /* 2012/03/12 by jian for auto sumBy Row & Col */
            var tBody = getData(c.parentNode.parentNode, 'iTbody');
            if (c.className == jInfo.clsName.cellUpdated) {
                setData(c, 'before', beforeUpdated);
                // save the value before updated and 如果有修改則執行callback function
                if (tBody.cellUpdated) tBody.cellUpdated({ cell: c, before: beforeUpdated, tBody: tBody });
                else if (tBody.sumRowOptions) tBody.sumRow(tBody.sumRowOptions);
            }

            var dtl = document.getElementById('detailRow');
            if (dtl !== null) tBody.tBody.removeChild(dtl);
            /* end 2012/03/12 */
        }
        else if (g_iBox) {
            g_iBox.style.visibility = "hidden";
            c = g_iBox.parentNode;
            var txt = g_iBox.childNodes[0].value;
            if (c.tagName == "TD") {
                if (txt != g_iBox.childNodes[1].value) c.className = jInfo.clsName.cellUpdated; //iBox.childNodes[0].className;
                document.body.appendChild(g_iBox); c.innerHTML = txt.replace(", ", "<BR>"); c.onclick = td_onclick;
            }
        } 
    }

    function jElement(o)
    {
        t = extend({}, o);
        var _element;

        if (defined(o.DOMElement)) {
            _element = o.DOMElement;
        }
        else if (t.tag && typeof t.tag === 'string') {
            _element = DOC.createElement(t.tag);
        }
        

        var ret = 
        {
            $element: $(_element),
            element: _element,
            appendTo: function(parent)
            {
                //if( Object.prototype.toString.call( someVar ) === '[object Array]' )
                if (parent && isElement(parent)) {
                    parent.appendChild(_element);
                }
            },
            removeAll: function() 
            {
                if (_element) {
                    while(_element.childNodes.length > 0)
                        _element.removeChild(_element.childNodes[0]);
                }
                //return this;
            },
            append: function(o) {
                var $children = $(o);
                $(_element).append($children);
            }
        };

        return ret;
        

        function isElement(obj) {
            try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
               return obj instanceof HTMLElement;
            }
            catch(e){
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
                return (typeof obj==="object") &&
                       (obj.nodeType===1) && (typeof obj.style === "object") &&
                       (typeof obj.ownerDocument ==="object");
            }
        }

    }

    /*+parserIdx jTbody.prototype.jTbody(object) 
    ptions,
    colStyle[]: column styles [{toFixed:2,textAlign:'left'},{},{}...]
    parentNode: jTable object of the parent table
    post : post to ajax (columns: array of columnName,sf: sqlstr flag, sf:if true post the sqlstr)) 
    url : ajax url 
    parserEnd */

    var jTbody = function (o) {
        var bd = this;
        if (defined(o)) bd.init(o);
        return bd;
    };
    /*+parserIdx jTbody.prototype.createHeader([string..], integer)
    sArray: ['col1','col2','+c','col3'] +c: column merge 
    */
    jTbody.prototype = {
        type: 'jTbody'
	, init: function (o) {
	    o.plotOptions = deepExtend({ events: {} }, o.plotOptions);
	    /* bug: deepExtend , parentNode:jTable, called by value not called by reference */
	    var t = extend({ colStyle: [], edFlag: g_edFlag.slice(0), editable: true, headerRowCount: 0, parentNode: null
, rowsPerPage: 10, curPage: 0, url: g_URL + 'ajax/Tbl2JSON.aspx'
	    }, o);
	    var bd = this;
	    bd.tBody = t.tBody;
	    bd.headerRowCount = t.headerRowCount;
	    bd.rows = bd.tBody.childNodes;
	    bd.edFlag = t.edFlag.slice(0);
	    bd.url = t.url;
	    bd.post = extend({ columns: [], condition: '', groupBy: [], orderBy: [], param: [], tableName: '', sf: false }, o.post);
	    bd.parentNode = t.parentNode;
	    bd.editable = t.editable;
	    if (defined(t.colStyle)) bd.colStyle = t.colStyle.slice(0);
	    else bd.colStyle = new Array();
	    bd.rowsPerPage = t.rowsPerPage; /* rows per page */
	    bd.curPage = 0; /* current page number */
	    bd.param = t.param;
	    /* 儲存this pointer於table body 的data內，以便tbody, tr,td可以取得jTbody物件 */
	    setData(t.tBody, 'iTbody', bd);
	    t.tBody.tbody = bd; /* 2012/12 1.4.s */
	    bd.data = {}; /* new the data object */
	    bd.cellUpdated = o.cellUpdated;
	    bd.options = t;
	    for (eventType in t.plotOptions.events) {
	        addEvent(bd, eventType, t.plotOptions.events[eventType]);
	    }
	    return bd;
	},
        createHeader: function (sArray, idx, clsName) {
            var bd = this, bdy = bd.tBody;
            clsName = pick(clsName, jInfo.clsName.defHeader);
            var c, i, r = appendChild(bdy, { tag: 'TR', insBefore: (idx < 0) ? undefined : bd.rows[idx] }); /* 2012/11 remove className:'myFixedRow' */
            for (i = 0; i < sArray.length; i++) {
                if (sArray[i].substr(0, 2) == '+c') c.colSpan = parseInt(sArray[i].substr(2), 10);
                else if (sArray[i].substr(0, 2) == '+r') c.rowSpan = parseInt(sArray[i].substr(2), 10);
                else c = appendChild(r, { tag: 'TH', innerHTML: sArray[i], className: clsName });
            }
            bd.headerRowCount++;
            /* check col or row span */
            if (bdy.childNodes.length < 2 || (bdy.firstChild.lastChild.offsetLeft + bdy.firstChild.lastChild.offsetWidth) == (r.lastChild.offsetLeft + r.lastChild.offsetWidth))
                r.lastChild.className += 'R';
            return r.sectionRowIndex;
        } /* end of createHeader */
, createSQL: function () {
    var bd = this;
    var s = "select " + colStr(bd.post.columns, "") + " from " + bd.post.tableName;
    if (bd.post.condition != "") s += " where " + bd.post.condition;
    s += colStr(bd.post.groupBy, " group by ") + colStr(bd.post.orderBy, " order by "); return s;
}

        /*+ parserIdx jTbody.prototype.crossTab(object) +*
        this.CT.xCols[I1,I2..]: In is the column number of return data array ，縱軸要比對的key值,（可以是複合key)
        this.CT.measures[]: array of measure values，例如：數量、金額等加總值
        o.maxCol(integer) :  最後表格的總欄位數, 縱軸深度加上水平軸分類數
        o.yCol(integer) : the column index which will been transfer to 水平軸
        o.yIdx(function(cell.innerText))
        o.yIdxType(string): 'cellElement' o.yIdx=function(cellelement,tBody) : 
        o.fRow(HTMLTableRowElement,this.rows[0]) : from row to cross table
        yCol:return data Key要比對水平軸表頭data的號碼) 
        o.hdr(HTMLTableRowElement) : ver 2.0 新增, 如果水平軸Header分類已知例如成品、半成品、物料等分類

        expample: crossTab (xCols:[Integer...], 
        prod, 月份, qty
        ----------------
        xx  , Feb   , 20
        xx  , Mar  , 30
        yy  , Mar , 10
        ==>
        prod,  Feb, Mar
        -----------------
        xx  , 20 , 30 
        yy  ,   0, 10
   
        crossTab 類別：
        1.固定欄位:例如月份或日期固定30天展開，資料不需先by 日期sort, 
        2.不固定欄位：需先sort過，依資料值由小至大但不固定欄位數目。（動態產生）
        parserEnd*/
, crossTab: function (o) {
    var bd = this, r, i, j, r0, colId; /* r0 : compar */
    var eql = false;
    var mea = new Array();
    var maxCol = (bd.parentNode.tHead.rows.length > 0) ? bd.parentNode.tHead.rows[0].childNodes.length : 10;
    if (bd.rows.length <= 0) return;
    /* sort the table by cols, before cross tab */
    if (o.sort) {
        if (typeof (o.sort) == 'object') bd.sort(extend({ colsId: o.xCols }, o.sort));
        else bd.sort({ colsId: o.xCols });
        o.fRow = bd.rows[0];
        o.rowCount = bd.rows.length;
    }
    r = r0 = (o.fRow) ? o.fRow : bd.rows[0];
    if (!defined(bd.CT)) bd.CT = extend({ yCols: [] }, { measures: o.measures, xCols: o.xCols });
    if (!defined(bd.CT.measures)) bd.CT.measures = [r.childNodes.length - 1];
    for (j = 0; j < bd.CT.measures.length; j++) mea.push('-');
    if (!defined(o.yIdx)) {
        if (!defined(o.hdr)) o.hdr = bd.parentNode.tHead.rows[1]; /* cube default */
        o.yIdx = function (c, bd, hdr) {
            var hdc, hr = hdr, ret = c.cellIndex, c1 = c;
            try {
                hdc = hdr.childNodes[1];
                while (hr.nextSibling) {
                    for (var c0 = hdc; c0; ret += c0.colSpan, c0 = c0.nextSibling) {
                        if (c0.innerText == c.innerText) { break; }
                        else if (c0.innerText == '') { c0.innerText = c.innerText; break; }
                    }
                    hr = hr.nextSibling;
                    hdc = hr.firstChild;
                    c = c.nextSibling;
                } /* end of while all header rows */
                return Math.min(ret, maxCol - 1);
                /* not found */
                /*childNodes.length-1; /* not found */
            } catch (e) { return maxCol - 1; } 
        }

    }
    var count = 0, rowCount = (o.rowCount) ? o.rowCount : 1000;
    var maxXCol = bd.CT.measures[bd.CT.measures.length - 1], deep = bd.parentNode.tHead.rows.length - 2;
    var getElementValue = function (me, idx) {
        if (typeof (idx) == 'string') { var i = parseInt(idx, 10); return (isNaN(i) || i > me.childNodes.length) ? getData(me, idx) : me.childNodes[i].innerText; }
        else try {
            return me.childNodes[idx].innerText;
        }
        catch (e) { return null; }

    }

    while (defined(r) && count++ <= rowCount) {
        if (r.childNodes.length < maxXCol) continue;
        for (j = 0, eql = true; j < bd.CT.xCols.length; j++) if (getElementValue(r, bd.CT.xCols[j]) != getElementValue(r0, bd.CT.xCols[j])) {
            r0 = r; eql = false; break;
        }
        /* 這裡將來要改寫，用o.yIdx.apply(c,[]); ...*/
        colId = o.yIdx.apply(r, [r.childNodes[o.yCol], bd, o.hdr]); //放bd for 向下相容 r.childNodes[o.yCol],bd);
        //o.yIdx(r.childNodes[o.yCol].innerHTML); /* cell innertext */
        for (j = 0; j < this.CT.measures.length && maxXCol < r.childNodes.length; j++) {
            mea[j] = r.childNodes[bd.CT.measures[j]].innerHTML;
            r.childNodes[bd.CT.measures[j]].innerHTML = '0';
        }

        for (var d = 0; d < deep; d++) r.removeChild(r.childNodes[o.yCol]);

        upserCol({ r: r0, cidx: colId, val: mea, maxCol: (o.maxCol) ? o.maxCol : maxCol, yType: o.yType });
        if (o.cbData) for (i = 0; i < o.cbData.length; i++) setData(r0.childNodes[colId], o.cbData[i], r.data[o.cbData[i]]);
        if (eql && r.sectionRowIndex > 0) bd.tBody.removeChild(r);
        r = r0.nextSibling;
    }
    bd.CT.yCols.push(o.yCol); /* for reference only */
}
, destroy: function () {
    var bd = this, n;
    removeEvent(bd);
    bd.tBody.parentNode.removeChild(bd.tBody); /* 移除 body dom element */
    /* 移除 Object  , delete 只刪除pointer 本身物件不會清除，待所有pointer = null 時，garbage 會自動被清除*/
    for (n in bd) { delete bd[n]; }
    return null;
}
        /* 產生整個body要修改或新增的SQL string
        param:
        r : 只檢查該行（default 全部）
        colName[string]: default 欄位名稱，沒有show在body上 ( for 新增only)
        vals[string]: default 欄位值 (for 新增 only)
        ****
        remark: body 必須先設定 post 物件  post: {tableName: string, columns:[欄位名稱第一個字大寫為字串，小寫為數字型態]} 
        generate sqlstr by cellupdate 
        meetingminutes 用到此function, 及post 物件
        */
, getColInfo: function (o) {
    var bd = this, col, idx = (typeof (o) == 'object') ? o.idx : o;
    if (bd.post.columns.length > idx) col = bd.post.columns[idx];

    else { //沒有先設定，則取header 名稱
        var hd = bd.parentNode.tHead;
        var c = hd.tBody.lastChild.childNodes[idx];
        col = { n: c.innerText, t: 's' };
    }
    if (typeof (col) == 'string') col = { n: col, t: (col.substr(0, 1) > "Z") ? 'd' : 's' }; //第一個字小寫是數字    			
    return col;
}

, getColStyle: function (idx) {
    var bd = this;
    for (var i = 0; i < bd.colStyle.length; i++) {
        if (bd.colStyle[i].idx == idx) return bd.colStyle[i];
    }
    return undefined;
}
        /* get the tree node innerText of parent node, only for tree leave */
, getTNText: function (r) {
    var bd = this;
    // check if bd.data.treeLayer == r.data.layer 
    //if (bd.data.treeLayer == r.data.layer) return null;
    var s = '';
    var l = r.data.layer;
    s = r.childNodes[l].innerText;

    while (--l >= 0) {
        r = r.previousSibling;
        while (r) {
            if (r.data.layer == l) { s = r.childNodes[l].innerText + ',' + s; break; }
            else r = r.previousSibling;
        }
    }
    return s;
}
        /* dbSID:string 直接寫入資料庫 */
, generateSQL: function (o) {
    var bd = this;
    var r = pick(o.r, bd.rows[bd.headerRowCount]), c, i, j, rtmp = '', fst, s, s2;
    var toR = pick(o.r, bd.tBody.lastChild);
    if (!defined(o.newRow)) o.newRow = 'JTNewRow';
    if (!defined(o.colsName)) o.colsName = [];
    writeBack(); //should remove writeBack which before generateSQL from meetingminutes
    for (; r && r.sectionRowIndex <= toR.sectionRowIndex; r = r.nextSibling) {
        /* 有 rowid 修改 */
        if (defined(r.data) && (defined(r.data.rowid) || defined(bd.post.piCN))) { // update the row by rowid
            /* 有rowid 用rowid 沒有就用pi */
            var piCN = pick(bd.post.piCN, 'rowid'); /* the column name of pi */
            if (o.deleteRow == true) {
                s = 'delete ' + bd.post.tableName;
            } else {
                fst = 'update ' + bd.post.tableName + ' set '; s = '';
                for (c = r.firstChild; c; c = c.nextSibling) {
                    if (c.className == jInfo.clsName.cellUpdated) {
                        var col = bd.getColInfo(c.cellIndex), sValue = encodeHTML(c.innerHTML);
                        if (col.t == 'na') continue;
                        else if (col.t == 'd') s += fst + col.n + "=" + sValue.toInt();
                        else if (col.t.search(':val') >= 0) s += fst + col.n + "=" + col.t.replace(':val', "'" + sValue + "'");
                        else s += fst + col.n + "='" + sValue + "'";
                        fst = ',';
                    }
                }
            } /* else update */
            if (s != '') {
                if (typeof (piCN) == 'string') {
                    rtmp += s + " where  " + piCN + "='" + encodeHTML(r.data[piCN]) + "';"; /* piCN 是一個欄位或rowid */
                } else {
                    var s1 = ' where ';
                    for (j = 0; j < piCN.length; j++, s1 = ' and ') {
                        s += s1 + piCN[j] + "='" + encodeHTML(r.data[piCN[j]]) + "'";
                    }
                    rtmp += s + ";";
                } /* else pi is an array */
            }

        }
        /* 無rowid 新增 */
        else if (o.newRow == true || r.className == o.newRow) {
            s = s2 = fst = '';
            for (c = r.firstChild; c; c = c.nextSibling) {
                var col = bd.getColInfo(c.cellIndex), sValue = encodeHTML(c.innerHTML);
                if (col.t == 'na') continue;
                s += fst + col.n;
                if (col.t == 'd') {
                    if (sValue.substr(0, 1) == "(") s2 += fst + (0 - parseFloat(sValue.substr(1, sValue.length - 2)));
                    else s2 += fst + parseFloat(sValue);
                }
                else if (col.t == 's') s2 += fst + "'" + sValue + "'";
                else if (col.t.search(':val') >= 0) s2 += fst + col.t.replace(':val', "'" + sValue + "'"); //  to_date( sValue , 'yyyymmdd'); 
                else s2 += fst + "'" + sValue + "'";
                fst = ',';
            }
            /* set the default value */

            for (j = 0; j < o.colsName.length; j++) { s = o.colsName[j] + ',' + s; s2 = o.val[j] + ',' + s2; }
            rtmp += 'insert into ' + bd.post.tableName + '(' + s + ") values(" + s2 + ');';
        } 
    }
    if (defined(o.dbSID)) {
        return executeSql({ data: { dbSID: o.dbSID, storeproc: encodeSql(rtmp) }, async: false, url: o.url });
    }
    else return rtmp;
}

        /*+ parserIdx jTbody.prototype.groupRows(cols:integer,mc:[integer],idx:integer,rf:integer,rt:integer,f:function...) +*
        group the columns [+] with tree 
        cols (integer,1): number of columns ,from column 0 to column [cols-1], max:4
        idx (integer,0): the first column index to be group by (目前版本一定要從0開始,保留未來可以不用從0開始的彈性) 
        mc[integer]: measure columns index 需要被加總的欄位，使用方法同sumCol
        //layer(integer,0): protected (don't assign) 
        fId,tId: from number rf to less the rt row index (rt<= row id <rf), default rf=0, rt= rows.length  
        f[]: function of measure  groupCol({clos:1,mc:[4,5]}); 
        l: protected(don't assign) the layer of the tree node, root=0 
        fs: font size 設定
        rowClass (string,'JTNodeRowsG0') : 加總的資料列 class name, sumCol
        sumNode(boolean): 是否新增一行來summary 
        parserEnd 
        注意：
        在insertRow 時設定 className:'TNRow'，才不會有底線
        */

, groupRows: function (o) {
    var bd = this, r, c, i, tid;
    var t = extend({ rowClass: 'JTNodeRowG0', l: 0, idx: 0, cols: 1, mc: [], fId: 0, f: [], tId: bd.rows.length - 1 }, o);
    if (!defined(o.treeLayers)) bd.parentNode.treeLayers = t.cols + 1; /* 2013/03 紀錄 tbody tree node 總共有幾層 */
    if (!defined(o.gcClass)) t.gcClass = (t.cols > 1) ? jInfo.clsName.treeE : jInfo.clsName.treeC;  /* JTE default 打開,倒數第一個 */
    if (t.cols > 4) t.cols = 4;
    t.tId = bd.sumCol({ bFlag: 'top', gc: t.idx, gcClass: t.gcClass
		, sumNode: o.sumNode, l: t.l, fs: o.fs
		, mc: t.mc, className: t.rowClass, f: t.f, tId: t.tId, fId: t.fId
    });

    if (t.cols > 1) {
        var sumRows = [];
        //each(bd.tBody.rows, function(sr,srId) {
        for (var sr = bd.tBody.rows[t.fId]; sr && sr.sectionRowIndex < t.tId; sr = sr.nextSibling) {

            if (defined(sr.data) && sr.data.layer == t.l) sumRows.push(sr);
        }
        for (tid = t.tId, i = sumRows.length - 1; i >= 0; i--) { //會insert row所以從後面group回來
            r = sumRows[i];
            if (r.sectionRowIndex < tid) /* 有可能 沒有子孫 */{
                var nr = r.nextSibling;
                if (nr && nr.childNodes.length > t.idx + 1 && nr.childNodes[t.idx + 1].innerText == '-') {
                    for (; nr && nr.sectionRowIndex <= tid; nr = nr.nextSibling) {
                        nr.removeChild(nr.childNodes[t.idx + 1]);
                        c = nr.childNodes[t.idx + 1];
                        c.colSpan += 2;
                        c.className = jInfo.clsName.treeNode;
                    }
                }
                else
                    bd.groupRows({ bFlag: 'top', treeLayers: bd.parentNode.treeLayers, cols: t.cols - 1, l: t.l + 1, idx: t.idx + 1, gcClass: o.gcClass, mc: t.mc
				, f: t.f, fId: r.sectionRowIndex + 1, tId: tid, sumNode: o.sumNode, fs: o.fs
                    });
            }
            tid = r.sectionRowIndex - 1;

        }
    }
}

        /*+ parserIdx jTbody.prototype.insRow(object) +*
        inser a row into body
        o.data[string]:array of data
        o.className(string,jInfo.clsName.oRow) : class name of row
        o.cellClassName(string,jInfo.clsName.treeCell) : class name of each cell
        o.idx(integer,-1)
        o.editable(boolean) : wether or not to set the onclick event according to edFalg
        idx: the row index to insert before, default -1 (the last) */
        //快速插入一行
, insRow: function (o) {
    var i, j, k, s = '', r = document.createElement('TR'); r.data = {};
    k = (o.cbData) ? o.data.length - o.cbData.length : o.data.length;
    for (i = 0; i < k; i++) appendChild(r, { tag: 'TD', innerText: o.data[i] });
    for (j = 0; i < o.data.length; i++, j++) r.data[o.cbData[j]] = o.data[i];
    if (o.className) r.className = o.className; else r.className = (Math.round(r.sectionRowIndex / 2.0) * 2.0 == r.sectionRowIndex) ? jInfo.clsName.eRow : jInfo.clsName.oRow;
    this.tBody.appendChild(r);
    return r;
}
        /*+ parserIdx jTbody.prototype.insertRow(object) +*
        intert one row to tBody 
        param@
        data[string] : data array been inserted to
        cbData[string]: data array 後方的資料隱藏於cell 內不顯示。（從後面數來）
        ex：data=['a','b','c'],  cbData=['colName'] 則畫面顯示 'a','b' and set row.colName='c';
        editable: booling
        parseEnd */
, insertRow: function (o) {
    var c, i, j, s, r, bd = this;
    var t = extend({ cbData: [], idx: -1, r: false }, o);
    if (t.r) r = t.r;
    else {
        r = DOC.createElement('TR');
        for (i = 0; i < t.data.length - t.cbData.length; i++) {
            s = (!defined(t.data[i])) ? '' : '' + t.data[i]; /* to string */
            if (s.substr(0, 2) == '+c') c.colSpan = parseInt(s.substr(2), 10);
            else if (s.substr(0, 2) == '+r') c.rowSpan = parseInt(s.substr(2), 10);
            else {
                c = appendChild(r, { tag: 'TD', innerHTML: decodeHTML(s) });
                if (o.cellClassName) c.className = o.cellClassName;
                if (t.editable && bd.edFlag[i] > 0) {
                    if (bd.edFlag[i] == gc_edDeleteRow) { c.onclick = function () { td_deleteRow(this); }; c.style.cursor = "pointer"; } /* jian 2013/4/11 for meetingminutes delete row */
                    else if (bd.edFlag[i] == gc_edDblclk) c.onclick = td_ondblclick; /* on touch double click does not work so set to onclick */
                    else if (bd.edFlag[i] == gc_showDetail) c.onclick = td_showDetail;
                    else c.onclick = td_onclick;
                    if (bd.edFlag[i] == gc_edTextArea || bd.edFlag[i] == gc_edACP) c.style.wordWrap = "break-word"; // for textArea        				
                }
            }
        }
        for (j = 0; i < t.data.length; i++, j++) setData(r, t.cbData[j], t.data[i]);
        /* 設定欄位格式*/
        if (bd.colStyle) {
            for (i = 0; i < bd.colStyle.length; i++) {
                if (bd.colStyle[i].idx) setStyle(r.childNodes[bd.colStyle[i].idx], bd.colStyle[i]);
                else setStyle(r.childNodes[i], bd.colStyle[i]);
            } 
        }
    }
    if (t.idx < 0 || t.idx >= bd.rows.length) bd.tBody.appendChild(r);
    else bd.tBody.insertBefore(r, bd.rows[t.idx]);
    if (t.className) r.className = t.className;
    else r.className = (Math.round(r.sectionRowIndex / 2.0) * 2.0 == r.sectionRowIndex) ? jInfo.clsName.eRow : jInfo.clsName.oRow;
    if (bd.parentNode.type == 'treeTable') {
        //	c= defined(o.treeCellIndex)? r.childNods[o.treeCellIndex]:r.firstChild;
        if (!defined(r.data)) r.data = { layer: 0, childNum: 0 };
        else if (!defined(r.data.layer)) { r.data.layer = 0; r.data.childNum = 0; }
    } else if (!t.className) r.className += ' JTNodeRowG0';

    return r;
}


        /*+ don't user this function 2013/04 replaced with ajax.apply(bd)  +*
        load the data (jason format) into table body 
        if jTbody.sf=false
        you should set the sql string and url at the jTbody object attribute before call this function
        jTbody.url : type string
        jTbody.post : type object (see jTbody)
        options:
        o (object)
        #o.async(boolean,default=true) : async=ture 非同步(doesn't wait for callback)
        #o.idxHeader(int,-2) : -2 no header, -1 copy the header to tHead (last row)
        #o.tbCols (boolean,false) : reset the toolbar colspan
        #o.cbData [string,string...]: 儲存callback data 於row 的data物件內，不放在該row的td欄位 
        #o.dbSID (string): the database connect name configured on webserver 'sdb2', 'pcmoss',... 
        #o.sqlstr(string): the sql string post to aspx, when this.sf=false
        #o.callback (function) :
        #* example : loadJSONtoRows({callback:xxxx});
        psrserEnd */
, loadJSONtoRows: function (o) {
    var i, r, t = {}, p = { dbSID: 'sdb2' };
    var rCount = 0; /* number of rows returned */
    t = extend({ async: true, idxHeader: -2, tbCols: false, cbData: [], editable: this.editable, url: this.url }, o); /* p: 要以ajax傳(post) 給aspx程式的參數request */
    /* sf(boolean,default false) :  is sf=true 必須先設定tablename, column name 等等）自我產生SQL string, （sf=false 由sqlstr參數傳入）*/
    if (o.data) p = extend(p, o.data);
    else if (this.sf) p = extend(p, { 'sqlstr': this.createSQL() });
    else { p.sqlstr = o.sqlstr; p.colName = o.colName; }
    if (o.dbSID !== null) p.dbSID = o.dbSID;
    for (i = 0; i < this.post.param.length; i++) p['param' + i] = this.post.param[i];
    loadJSONtoRows({ decode: true, tBody: this, url: t.url, data: p, async: t.async, dataType: 'json', editable: t.editable, callback: t.callback, eachRow: t.eachRow, cbData: t.cbData });
}

        /*+ parserIdx jTbody.prototype.mergeRow(idx) +*
        判斷cell.innerText一樣的話，則往下合併儲存格(rowSpan)
        param@idx(integer): column index
        isHide: default false remove the cell, if true then hide the cell rether than delete it 
        ps. 兩個欄位以上，需要另外處理（請由右至左）, rowSpan之後 cellIndex已錯位 
        psrserEnd */
, mergeRow: function (idx, isHide) {
    var s, c, cr, nr;
    cr = this.tBody.firstChild;
    if (!defined(cr)) return;
    c = cr.childNodes[idx];
    c.style.rowSpan = 1;
    if (!defined(c)) return;

    for (nr = cr.nextSibling; nr; nr = nr.nextSibling) {
        var nextCol = nr.childNodes[idx];
        if (!defined(nextCol)) {
        }
        else if (nextCol.innerText == c.innerText) {
            c.rowSpan += 1;
            if (isHide) nextCol.style.display = 'none';
            else nr.removeChild(nextCol);
        }
        else {
            cr = nr;
            c = nextCol;
        }

    }
}
, onFilterRowClick: function (e) {
    var bd = this;

    for (var c = e.row.firstChild; c; c = c.nextSibling) {
        if (c == e.cell) {
            if (defined(e.cell.filter)) e.cell.filter.show();
            else e.cell.filter = new jFilter(e.cell.filterOption);
        }
        else if (defined(c.filter)) c.filter.hide();
    }

}, onRowClick: function (e) { /* e is an EventObject and include argement attatched with fireEvent */
    var bd = this;
    if (defined(bd.parentNode.cube)) {
        fireEvent(bd.parentNode.cube, 'RowClick');
    }

}
        /*+ parserIdx jTbody.prototype.removeAll(integer)

        rows except headerrow 
        */
, removeAll: function (headerRow) {
    var tbd = this, bd = tbd.tBody;
    for (var i = bd.childNodes.length - 1; i >= headerRow; i--) bd.removeChild(bd.childNodes[i]);
    tbd.headerRowCount = Math.min(bd.childNodes.length, tbd.headerRowCount);
}, setStrippedRow: function () {
    var i;
    for (i = this.headerRowCount; i < this.tBody.childNodes.length - 1; i += 2) {
        this.tBody.childNodes[i].className = jInfo.clsName.oRow; //'normalRow';
        for (c = this.tBody.childNodes[i].firstChild; c; c = c.nextSibling) c.style.border = '0px none';
        this.tBody.childNodes[i + 1].className = jInfo.clsName.eRow;
        for (c = this.tBody.childNodes[i + 1].firstChild; c; c = c.nextSibling) c.style.border = '0px none';

    }
    if (i == this.tBody.childNodes.length - 1) this.tBody.childNodes[i].className = jInfo.clsName.oRow;
}

        /*+ parserIdx jTbody.prototype.setColsStyle([object...]) +*
        object is {textAlign:string,toFixed:integer}   
        parserEnd 
        例如： div=1000, toFixed=1, 除以1000取小數點後1位
        setColsStyle({idx:1, textAlign:'right', toFixed:1, div:1000},{idx:3, textAlign:'center'});
        */

, setColsStyle: function (o) {
    if (this.rows.length == 0) return;
    var r, c, i, j, k
		, t = this.colStyle.slice(0);
    t = extend(t, o);
    for (i = this.headerRowCount, r = this.rows[this.headerRowCount]; i < this.rows.length; i++, r = r.nextSibling) {
        k = Math.min(r.childNodes.length, t.length);
        for (j = 0; j < k; j++) {
            try { c = (t[j].idx >= 0) ? r.childNodes[t[j].idx] : r.childNodes[j]; if (c) setStyle(c, t[j]); }
            catch (err) { alert(err); }
        }
    }
}


        /*+ parserIdx jTbody.prototype.sort({colsId[integer],colsType[string]) +*
        sort the rows by cols
        exp. sort({colsId:[0,1,2], colsType:['i','s'],adFlag:['a','d']});  (column 0 is integer, column 1 is string), d:descendent
        }
        parserEnd*/
, sort: function (o) {
    /* default sort from first row to last row */
    var bd = this, t = extend({ fId: 0, tId: bd.rows.length - 1, colsType: [], adFlag: [] }, o);
    if (t.fId - t.tId >= 0) return;
    var i, tId = t.tId;
    // set column attr by HTMLTABLECellElement
    if (t.cols) {
        t.colsId = new Array();
        t.adFlag = new Array();
        t.colsType = new Array();
        for (i = 0; i < o.cols.length; i++) {
            t.colsId.push(o.cols[i].cellIndex);
            var div = o.cols[i].lastChild;
            if (div.tagName.toUpperCase() == 'DIV') t.adFlag.push(div.className == jInfo.clsName.hdSortedA);
            else t.adFlag.push(pick(o.cols[i].adFlag, true));
            t.colsType.push(pick(o.cols[i].dataType, 's'));
        }
    } else {
        /* set the default column data type is string */
        if (t.colsType.length == 0) for (i = 0; i < t.colsId.length; i++) t.colsType.push('s');
        /* set the default column data type is asec */
        if (t.adFlag.length == 0) for (i = 0; i < t.colsId.length; i++) t.adFlag.push(true);
    }
    for (i = t.fId + 1, t.tId = t.fId, t.r = bd.rows[t.fId + 1]; i <= tId; t.tId = i++, t.r = bd.rows[i]) bd.insSort(t); /* insert t.r to array[t.fRow..t.tRow] */
}
        /*+ parserIdx jTbody.prototype.insSort({
        t.colsId([integer...]), t.cbData(if sorted by cbData)
        t.adFlag([boolean])
        t.colsType([string]) i : integer, s : string
        t.r(HTMLTableRowElement): the row been insert
        t.fId(integer) : from row index
        t.tId(integer) : to row index 
        o.rFlag(integer,-1) : when eqlual at hash value, -1:insert after,rFlag=0: if equal then return true but not insert or update, rFlag=1: update return true (found), false (not found)
        }insertion sort */

, insSort: function (t) {
    var ri, cid = t.fId, i, bd = this;
    var hash = [];
    for (i = 0; i < t.colsId.length; i++) hash.push(getElementValue(t.r, t.colsId[i]));
    var found = false;
    do {
        ri = bd.rows[cid];
        for (i = 0; i < t.colsId.length; i++) {
            val = aGb({ a: hash[i], b: getElementValue(ri, t.colsId[i]), asec: t.adFlag[i], dataType: t.colsType[i] });
            if (val == 1) {
                bd.tBody.insertBefore(t.r, ri);
                return found;
            } else if (val < 0) break;
            else if (i == t.colsId.length - 1) { /* equal key */
                if (t.rFlag == 0) found = true; /*key found, stop insert*/
                else found = true; /* insert into next row, or do replace here */
            }
        } 
    } while (++cid <= t.tId);
    return found;
}

        /*+ parserIdx jTbody.prototype.sumCol({gc:integer,mc:[integer],bFlag:string,f:[function],rdata:string}) +*
        set the summarize value of column to the table foot 
        gc (integer) : column index of groupby column (should be sorted before..)
        mc ([integer...]) : column indies of measure 
        bFlag (string): options ('top','bottom') 
        bFlag=top, insert a row before the row1 with group name, and summay,tgt must be false
        bottom, after the last row of the group
        else put the summary row at table tFoot, tgt: Foot
        bFlag(function(o)) : 可用的參數
        o.fcr, o.nr, o.a, o.ret 等 return sr (summary row)
        f([fUnction...],function(r,i){r+parseInt(i,10)}) : fUnction of sum -- count, or ..., 
        l: number,treeLayer
        sumNode: boolean 是否要新增一行來summary
        example:sumCol({bFlag:'top',gc:0,mc:[5,6],f:[function(r,d){ return r+parseInt(d,10);},function(r,d){ return r+1}]}); 
        o.rdata : sort by data which kept in data('o.rdata')
        ver 1.4.s 2013/01 修改gcClass
        parserEnd 

        */
, sumCol: function (o) {
    var bd = this, a = [], ret = [], r, c, i, j, cgc, ngc, s;
    if (bd.rows.length == 0) return;
    var t = extend({ f: [], className: jInfo.clsName.sRow, gcClass: false, fId: 0, tId: bd.rows.length - 1 }, o);
    for (i = 0; i < bd.parentNode.tHead.rows[0].childNodes.length; i++) a.push(' ');
    for (i = 0; i < o.mc.length; i++) {
        ret.push(0);
        if (t.f.length < i + 1) t.f.push(function (r, i) { return r + String(i).toInt(); });
        else if (t.f[i] == '' || t.f[i] === null) t.f[i] = function (r, i) { return r + String(i).toInt(); };
    }
    if (defined(o.rdata)) cgc = bd.rows[t.fId].data[o.rdata];
    else if (typeof (o.gc) == 'number' && bd.rows[t.fId] && bd.rows[t.fId].childNodes[o.gc]) cgc = bd.rows[t.fId].childNodes[o.gc].innerText;
    else cgc = pick(o.gc, 'all');
    /* i 到 t.tId+1 用來作最後一輪 group */
    tr = bd.rows[t.tId];
    r = bd.rows[t.fId];

    var fcr = bd.rows[t.fId]; //first child of first child node row 
    var sr, er = bd.rows[t.tId];
    var ext = false; /* extend loop */
    do {
        if (ext) ngc = null;
        else if (defined(o.rdata)) ngc = r.data[o.rdata];
        else if (typeof (o.gc) == 'number' && r.childNodes[o.gc]) ngc = r.childNodes[o.gc].innerText;
        else ngc = cgc; //pick(o.gc,'all');

        if (cgc != ngc || ext) { //  || i==t.tId+1) { /* || i==t.tId)  another group */
            a[o.gc] = cgc;
            /*產生group 行，把加總結果放入新增group*/
            var nd = { layer: o.l, nxsb: (ext) ? null : r, pvsb: sr, childNum: 0 }; /* parentNode data */
            if (typeof (o.bFlag) == 'function') {
                sr = o.bFlag.apply(bd, [{ fcr: fcr, a: a, ret: ret, nr: r}]);
            } else if (o.bFlag == 'top') {
                for (j = 0; j < o.mc.length; j++) a[o.mc[j]] = (typeof (ret[j]) == 'object') ? ret[j].result : ret[j];
                if (o.sumNode == false || (fcr && fcr.childNodes.length > o.gc_1 && fcr.childNodes[o.gc + 1].innerText == '-')) {
                    /* 不加總，使用第一行當加總 父節點 */
                    sr = fcr;
                    sr.className = t.className;
                    for (j = o.l; j < bd.parentNode.treeLayers - 1; j++) sr.removeChild(sr.childNodes[o.gc]);
                    sr.style.display = '';

                } else sr = jTbody.prototype.insertRow.apply(bd, [{ parentNode: fcr, data: a, idx: fcr.sectionRowIndex, className: t.className, cellClassName: t.cellClassName}]);
                fcr = r;
                if (t.gcClass) {
                    sr.data = extend(sr.data, nd);
                    sr.data.childNum = (r) ? r.sectionRowIndex - sr.sectionRowIndex - 1 : bd.rows.length - sr.sectionRowIndex - 1;

                    c = sr.childNodes[o.gc]; /* childNodes[o.gc] */
                    j = bd.parentNode.treeLayers - o.l;
                    c.colSpan = j;
                    if (o.sumNode != false) {
                        for (; j > 1; j--) sr.removeChild(c.nextSibling);
                        while (j-- > 1) sr.removeChild(sr.lastChild);
                        c.innerText = cgc;

                    }
                    sr.lastChild.className = jInfo.clsName.treeCell + 'R';
                    if (sr.data.childNum >= 1) {
                        c.className = t.gcClass;
                        c.onclick = function () { var c = this; fireEvent(c.parentNode.parentNode.data.iTbody, 'TNClick'); }
                    } else { /* when o.sumNode is false put text directly  */
                        c.className = jInfo.clsName.treeNode; /* show detail */
                    }
                    /* check if parentNode is last child of the grand parent node */
                    if (o.l > 0 && defined(c.previousSibling)) {
                        c = c.previousSibling;
                        /* the last summary node */
                        if (ext) {
                            c.className = jInfo.clsName.treeLeaf;
                            /* the son nodes of the last summary node remove border */
                            for (var j = 0, nr = sr.nextSibling; nr && j < sr.data.childNum; j = j + 1, nr = nr.nextSibling)
                            { if (nr.childNodes[o.gc - 1]) nr.childNodes[o.gc - 1].className = jInfo.clsName.treeEmp; }
                        }
                        else { c.className = (c.cellIndex == o.gc - 1) ? jInfo.clsName.tree1T : jInfo.clsName.tree1; }
                        /* 補足加總行的欄位跟第一個小孩一樣多,here, if necessary */
                        if (o.sumNode != false && sr.data.childNum > 0) { /* copy first node */
                            for (j = o.l - 2; j >= 0 && defined(c.previousSibling); j--) {
                                c = c.previousSibling;
                                c.className = sr.nextSibling.childNodes[c.cellIndex].className;
                            } 
                        }
                    } /* end of layer>0  */
                    sr.className = jInfo.clsName.treeRow + o.l;
                } /* end of tree if gcClass */
            } else { // 2013/4/2 never end when insert before r.sectionRowIndex+1
                for (j = 0; j < o.mc.length; j++) a[o.mc[j]] = (typeof (ret[j]) == 'object') ? ret[j].result : ret[j];
                sr = jTbody.prototype.insertRow.apply(bd, [{ parentNode: fcr, data: a, idx: (!defined(r) || !defined(r.nextSibling)) ? -1 : r.sectionRowIndex, className: t.className, cellClassName: t.cellClassName}]);
            }
            if (o.rdata) setData(sr, o.rdata, cgc);
            cgc = ngc; ret[0] = 0;
            for (j = 0; j < ret.length; j++) ret[j] = 0; /* reset the ret */

        }
        if (!ext) { /* check if last row to skip aggregation */
            for (j = 0; j < o.mc.length; j++) {
                /* check if the number of columns of each rows doesn't equal */
                try { s = r.childNodes[o.mc[j]].innerText.replace(/,/g, ''); }
                catch (err) { s = '0'; }
                ret[j] = t.f[j](ret[j], s, r);
            }
            if (t.gcClass && r.childNodes[o.gc]) {
                c = r.childNodes[o.gc]; /* childNodes[0] => childNodes[o.gc-layer]  */

                if (o.l == (bd.parentNode.treeLayers - 2)) { // last layer of this time
                    r.data = extend(r.data, { layer: o.l + 1 });

                    if ((o.sumNode != false || r != fcr) && defined(c.nextSibling)) {
                        var nc = c.nextSibling;
                        if (o.sumNode != false && r.childNodes.length > a.length) r.removeChild(r.lastChild);
                        if (bd.type == 'cubeBody') nc.className = jInfo.clsName.treeC;
                        else nc.className = jInfo.clsName.treeNode;
                        if (nc.nextSibling) r.lastChild.className = jInfo.clsName.treeCell + 'R';
                    }
                }
                c.innerText = '';
                c.className = (r == er) ? jInfo.clsName.treeLeaf : jInfo.clsName.tree1T;

                /* the most left cell with left-border and others without any border */
                if (c.cellIndex > 0) c.previousSibling.className = jInfo.clsName.tree1;

                if (String(t.gcClass).rSubLen(1) == 'E') { r.style.display = 'none'; }
            }
            if (r == er) ext = true;
            r = r.nextSibling;
        }
        else break;
        /*  setting groupRows data array (JT1T, JT11T or JT11TL ) */

    } while (1 == 1); /* end of for loop */

    if (o.rdata) setData(r, o.rdata, cgc);
    return (r) ? r.sectionRowIndex - 1 : bd.rows.length - 1;
}
        /*+ jTbody.prototype.sumCol2(0)
        o.sumClass (string,'JTNodeRow0') (JTSum re-do aggregation if set before ) */
, sumCol2: function (o) {
    var r, v = { ret: 0 }, t = extend({ className: jInfo.clsName.sRow, st: { toFixed: 0, textAlign: 'right' }, f: function (c, v) { v.ret += c.innerHTML.toInt(); return v; } }, o);
    for (r = this.tBody.firstChild; r; r = r.nextSibling) {
        if (r.childNodes.length > t.idx) {
            if (r.className == t.className) { r.childNodes[t.idx].innerHTML = v.ret; v.ret = 0; }
            else v = t.f(r.childNodes[t.idx], v);
            setStyle(r.childNodes[t.idx], t.st);
        } 
    } 
}
        /*+ parserIdx jTbody.prototype.sumRow(object) +*
        set the summarize value of column to the table foot 
        1. idx (integer,-1) : column index of ttl column, if -1 insert column at the end of row
        2. isIns(boolean,true) : true; 
        3. mc ([integer...]) : column indies of measure 
        4. f(function),function(r,i){r+parseInt(i,10)}) : function of sum -- count, or ..., 
        5. fRow(integer,this.headerRowCount) : the row index of the starting row
        6. tRow(integer,this.rows.length) : the last row index
        7. style(object,{toFided:0,textAlilgn:'right'}) : set the column Style
        example:sumRow({idx:0,mc:[5,6],f:function(r,d){ return r+parseInt(d,10);},function(r,d){ return r+1}}); 
        parserEnd*/

, sumRow: function (o) {
    //if (!o.t) o.t=this.parentNode.tHead.rows[this.parentNode.tHead.rows.length-1].childNodes[o.c].innerHTML;
    var ret = 0, r, c, i, j, gr = 0, s = '';
    var t = extend({ fId: this.headerRowCount, tId: this.rows.length - 1, idx: -1, isIns: true, f: function (r, i) { return r + String(i).toInt(); }, style: { toFixed: 0, textAlign: 'right'} }, o);
    for (i = t.fId; i <= t.tId; i++) {
        r = this.rows[i]; ret = 0;
        for (j = 0; j < t.mc.length && r.childNodes.length > t.mc[j]; j++) ret = t.f(ret, r.childNodes[t.mc[j]].innerHTML.replace(/,/g, '')); //0502 modify
        if (t.idx == -1 || t.isIns) c = appendChild(r, { tag: 'TD', insBefore: (t.dix >= 0 && t.idx < r.childNodes.length) ? undefined : r.childNodes[t.idx] });
        else c = r.childNodes[t.idx];
        c.innerHTML = (typeof (ret) == 'object') ? ret.ans : ret;
        if (t.style) setStyle(c, t.style);
    }
    this.sumRowOptions = extend({}, t);
}

        /*+ parserIdx jTbody.prototype.upsertCol
        endRowIdx: 搜尋比對的最後一行
        idx(integer or [integer...]) : column index to be search,可以是integer或 array
        value(string or [string...]) : 要搜尋的值可以是字串或字串陣列
        toIdx(integer) : the column index of the cell to be updated
        toValue(string) : 
        ins(boolean) : whether or not insert a new row when equal value not found
        isNewRow(boolean) : return whether inserted a new row or not
 
        parserEnd */
, updateRow: function (o) {
    var bd = this;
    var r = bd.searchRow({ idx: o.idx, value: o.value, endRowIdx: o.endRowIdx, like: o.like });
    if (r) { if (r.childNodes.length > o.toIdx) r.childNodes[o.toIdx].innerHTML = o.toValue; }
    else if (o.ins) {
        var a = [];
        var colCount = (o.maxCol) ? o.maxCol : bd.parentNode.tHead.tBody.firstChild.childNodes.length;
        while (a.length < colCount) a.push('0');
        if (typeof (o.idx) == 'number') a[o.idx] = o.value;
        else { for (var j = 0; j < o.idx.length; j++) a[o.idx[j]] = o.value[j]; }
        a[o.toIdx] = o.toValue;
        r = bd.insertRow({ idx: -1, data: a, className: 'JTNodeRow1' }); /*0512 JTNewRow改成JTNodeRow1  by wenling*/
        o.isNewRow = true;
    }
    return r;
}

, searchRow: function (o) {
    var isFound, r, i, toId = (o.endRowIdx != undefined) ? Math.min(o.endRowIdx, this.rows.length - 1) : this.rows.length - 1;
    if (typeof (o.idx) == 'number') {
        for (r = this.rows[0]; r && r.sectionRowIndex <= toId; r = r.nextSibling) {
            if (r.childNodes.length > o.idx) {
                if (o.like) { if (r.childNodes[o.idx].innerHTML.search(o.value) >= 0) return r; }
                else if (r.childNodes[o.idx].innerHTML == o.value) return r;
            }
        }
    }
    else {
        for (r = this.rows[0]; r && r.sectionRowIndex <= toId; r = r.nextSibling) {
            for (i = 0, isFound = true; i < o.idx.length; i++) {
                if (r.childNodes.length - 1 < o.idx[i]) { isFound = false; break; }  //0719 modify by wenling
                else if (o.like) {
                    if (r.childNodes[o.idx[i]] == undefined || r.childNodes[o.idx[i]].innerHTML.search(o.value[i]) < 0) { isFound = false; break; }
                }
                else if (r.childNodes[o.idx[i]].innerHTML != o.value[i]) { isFound = false; break; }
            }
            if (isFound) return r;
        } 
    }
    return false;
}

    }; /* end of jTbody prototype */


    var treeBody = extendClass(jTbody, {
        type: 'treeBody',
        insertRow: function (o) {
            /*+ parserIdx treeBody.prototype.insertRow(object) = return HTMLTableRowElement
            o.parentNode (HTMLTableRowElement) : parent node (row), at first, should set gRow.data.layer, gRow.data.childNum (integer)
            o.maxLayer(integer,4) : the maximum layer of tree 
            o.data([string...]) : as insRow
            o.idx : as insRow
            o.cbData : as insRow
            parserEnd */
            var i, c, rChild, l, bd = this, tbl = bd.parentNode;
            if (!defined(o.idx)) {
                if (defined(o.parentNode)) {
                    o.parentNode.data.childNum += 1;
                    o.idx = o.parentNode.sectionRowIndex + 1; /* default put bellow parent node */
                    l = o.parentNode.data.layer + 1;
                }
                else {
                    o.idx = -1;
                    l = 0;
                }
            } else l = o.parentNode.data.layer + 1;
            if (!defined(o.cbData)) {
                o.cbData = ['layer', 'childNum'];
                o.data.push(l); o.data.push(0);
            } else {
                if (!defined(o.data.layer)) { o.cbData.push('layer'); o.data.push(l); }
                if (!defined(o.data.childNum)) { o.cbData.push('childNum'); o.data.push(0); }
            }

            if (tbl.treeLayers <= l) {
                tbl.treeLayers++;
                bd.parentNode.insertCol({ width: 21, idx: 0 });
            }

            rChild = jTbody.prototype.insertRow.apply(bd, [{ data: o.data, idx: o.idx, cbData: o.cbData, className: jInfo.clsName.treeRow}]);
            //if (o.formatter) try { o.formatter.apply(rChild,[tbl]); } catch (e) {};

            if (tbl.scrollX) { /* move the measure columns to right side table body (the neighbor) after insert */
                var nr = appendChild(bd.tBody.neighbor, { tag: 'TR', className: jInfo.clsName.treeRow, insBefore: bd.tBody.neighbor.childNodes[rChild.sectionRowIndex] });
                for (var c = rChild.childNodes[1]; c && rChild.childNodes.length > 1; c = rChild.childNodes[1]) {
                    nr.appendChild(c);
                }
            }
            if (rChild.childNodes.length > 1) rChild.lastChild.className += " " + jInfo.clsName.treeCell + 'R';
            c = rChild.firstChild;

            c.colSpan = tbl.treeLayers - l + 1;

            if (o.style) extend(c.style, o.style);
            /* check if last layer */
            if (l >= tbl._maxVColumns - 1) c.className = jInfo.clsName.treeNode;
            else {
                c.className = jInfo.clsName.treeC;
                c.onclick = function () {
                    var e = event, c = this, bd = c.parentNode.parentNode.data.iTbody;
                    bd.drillDown(e);
                    fireEvent(bd, 'click', extend(e, { cell: c }));
                }; //2014/04 replaced collapseTN;
            }
            if (l >= 1) {
                c = appendChild(rChild, { tag: 'TD', insBefore: c, className: (o.parentNode.data.childNum == 1) ? jInfo.clsName.treeLeaf : jInfo.clsName.tree1T });
                for (i = l - 2; i >= 0; i--) {
                    var isPLast = o.parentNode.childNodes[i].className.rSubLen(1); /* is parent node last child */
                    isPLast = (isPLast == '0' || isPLast == 'L') ? jInfo.clsName.treeEmp : jInfo.clsName.tree1;
                    c = appendChild(rChild, { tag: 'TD', insBefore: c, className: (isPLast.rSubLen(1) == 'L') ? jInfo.clsName.treeEmp : isPLast });
                }
            }
            if (o.formatter) o.formatter.apply(rChild, [tbl]);
            return rChild;
        }, getParentNode: function (r) {
            var bd = this;
            for (var cr = r.previousSibling; cr; cr = cr.previousSibling) {
                if (cr.data.layer < r.data.layer) return cr;
            };
            return null;
        }
	, onTNClick: function (e) {
	    var bd = this;
	    bd.drillDown(e);
	}, toggleNode: function (e) {
	    var bd = this, c = pick(e.srcElement, event.srcElement), r = c.parentNode;
	    e.cancelBubble = true;
	    var l = r.data.layer, nb = bd.tBody.neighbor;
	    if (c.className == jInfo.clsName.treeE) {
	        r = r.nextSibling;
	        c.className = jInfo.clsName.treeC;
	        while (r && r.data.layer > l) {
	            r.style.display = 'none';
	            if (nb && nb.childNodes.length > r.sectionRowIndex) nb.childNodes[r.sectionRowIndex].style.display = 'none';
	            r = r.nextSibling;
	        }
	    }
	    else {
	        c.className = jInfo.clsName.treeE;
	        r = r.nextSibling;
	        while (r && r.data.layer > l) {
	            if (r.data.layer == l + 1) {
	                r.style.display = '';
	                if (r.childNodes[l + 1].className == jInfo.clsName.treeE) r.childNodes[l + 1].className = jInfo.clsName.treeC;
	                if (nb && nb.childNodes.length > r.sectionRowIndex) nb.childNodes[r.sectionRowIndex].style.display = '';
	            }
	            r = r.nextSibling;
	        }
	    }

	}
	, drillDown: function (e) {
	    var bd = this, c = pick(e.srcElement, event.srcElement), r = c.parentNode;
	    e.cancelBubble = true;
	    var l = r.data.layer;

	    var nb = bd.tBody.neighbor;
	    if (r.drillDown != false && bd.parentNode.drillDownURL) {
	        var dt = extend({}, extend(bd.data, extend({}, r.data)));
	        dt['param' + r.data.layer] = r.childNodes[r.data.layer].innerText;
	        for (var pr = bd.getParentNode(r); pr != null; pr = bd.getParentNode(pr)) {
	            dt['param' + pr.data.layer] = pr.childNodes[pr.data.layer].innerText;
	        }
	        for (var i = r.data.layer + 1; i < r.childNodes.length; i++) {
	            dt['param' + i] = r.childNodes[i].innerText;
	        }
	        /* 
	        parameter name should same with cube column name (ResponseHeader), or need hard conde at drillDown ajax */
	        ajax({ url: bd.parentNode.drillDownURL, data: dt
      		, lockAjax: { elm: c }
      		, eachRow: function (d) {
      		}, success: function (d, b, c) {
      		    for (var idx = d.length - 1; idx >= 0; idx--) { /* reverse order */
      		        //for (var idx=d[0]; idx< d.length; idx++) { /* reverse order */      			
      		        l_tbObjects.tBodies[0].insertRow({ data: d[idx], parentNode: r });
      		    }
      		    r.drillDown = false;
      		    r.childNodes[r.data.layer].className = jInfo.clsName.treeE;
      		}

	        });
	    } /* end of drilldown */
	    else bd.toggleNode(e);

	} /* treeBody.drillDown */

    });
    var cubeBody = extendClass(treeBody, {
        type: 'cubeBody',
        drillDown: function (e) {
            var bd = this, c = pick(e.srcElement, event.srcElement), r = c.parentNode;
            e.cancelBubble = true;
            var l = r.data.layer;

            var nb = bd.tBody.neighbor, cube = bd.parentNode;
            if (r.drillDown != false && l >= (cube.vCol.cols.length - 1)) {
                var dt = extend({}, extend(bd.data, extend({}, r.data)));
                dt['param' + r.data.layer] = r.childNodes[r.data.layer].innerText;
                for (var pr = bd.getParentNode(r); pr != null; pr = bd.getParentNode(pr)) {
                    dt['param' + pr.data.layer] = pr.childNodes[pr.data.layer].innerText;
                }
                for (var i = r.data.layer + 1; i < r.childNodes.length; i++) {
                    dt['param' + i] = r.childNodes[i].innerText;
                }
                bd.parentNode.loadData(dt, r);
            } /* end of ajax drilldown */
            else bd.toggleNode(e);
        } /* end of drillDown */
    });
    /* cube dimension left side (vertical) object
    setting vCol properties by table options  such as jTable({ vColumns: {...}   ... } ) 
    1. vCol.cube 
    2. vCol.cols = array of vCol
    */
    function vCol(cube, opt) {
        var vc = this;
        vc.cube = cube;
        vc.cols = opt;
        return vc;
    }
    vCol.prototype = {
        direction: 'vertical'
	, init: function () {
	    var vc = this, tHD, cube = vc.cube;

	    if (cube.scrollY) tHD = cube.tblObj.parentNode.previousSibling.tHead;
	    else tHD = cube.tHead.tBody;
	    var c = tHD.childNodes[1].firstChild; /* default first row first column */
	    c.style.cursor = 'pointer'; /* should here setting by css or inline style */
	    addEvent(c, 'click', function () { var td = this; event.cancelBubble = true; if (!defined(vc.state)) fireEvent(vc, 'ShowCol', { td: td }); });
	    resizeCell.apply(c, [c.colSpan - 1, vc.cube]);
	    resizeCell.apply(c.nextSibling, [c.colSpan, vc.cube]);
	}, toString: function () {
	    var s = '', vc = this, cube = vc.cube;

	    while (vc.cols.length > 5) vc.cols.pop(); //no more then 5, should defined in jTable.groupRow cols align
	    each(vc.cols, function (v, i) { s += ',' + v.name; });
	    if (s == '') s = getCookie(cube.name + vc.direction);
	    else {
	        s = s.substr(1);
	        setCookie(cube.name + vc.direction, s, 20);
	    }
	    return s;
	}
	, onConfigCol: function () {
	    var vc = this;
	    var container = appendChild(DOC.body, { tag: 'DIV', style: 'position:absolute;width:500px;height:280px;backgroundColor:gray;' });
	    container.style.left = Math.round((winWidth() - container.offsetWidth) / 2) + 'px';
	    container.style.top = Math.round((winHeight() - container.offsetHeight) / 2) + 'px';
	    var td = appendChild(container, { tag: 'DIV', style: 'position:absolute;top:20;left:2px;height:96px;backgroundColor:#c0c0c0' });
	    td.style.width = (container.offsetWidth - 4) + 'px';

	    vc.onShowCol.apply(vc, [{ td: td}]);
	    var div = appendChild(container, { tag: 'DIV', style: 'position:absolute;width:' + td.style.width + ';height:' + (container.offsetHeight - td.offsetHeight - td.offsetTop - 4) + 'px;left:2px;top:120px;backgroundColor:#c0c0c0;' });
	    div.style.top = (td.offsetHeight + td.offsetTop + 2) + 'px';
	    if (defined(vc.vCols)) {
	        var w = vc.vCols.split(',');
	        var fChg = function () {
	            var chk = this;
	            var div = chk.parentNode;
	            var divVc = div.previousSibling.firstChild; // UL element

	            if (chk.checked == false && divVc.childNodes.length <= 2) { chk.checked = true; alert('cannot less then 2 dimension'); return; }
	            else if (chk.checked == false) {
	                var txt = chk.value;
	                for (var i = vc.cols.length - 1; i >= 0; i--) {
	                    if (vc.cols[i].name == txt) {
	                        vc.cols.splice(i, 1);
	                        break;
	                    }
	                }
	            }
	            else if (divVc.childNodes.length > 4) {
	                chk.checked = false; alert('no more then 5 dimensions');
	            } else {
	                vc.cols.push({ name: chk.value });
	            }
	            // reset all
	            while (td.firstChild) td.removeChild(td.firstChild);
	            vc.onShowCol.apply(vc, [{ td: td}]);

	        }
	        each(w, function (v, i) {
	            var elm = appendChild(div, { tag: 'INPUT', type: 'checkbox', style: 'position:absolute;left:5px;top:' + (10 + i * 20) + 'px;', value: v });
	            var sp = appendChild(div, { tag: 'SPAN', innerHTML: v, style: 'cursor:pointer;position:absolute;left:25px;top:' + (10 + i * 20) + 'px;' });
	            elm.onclick = fChg;
	            sp.onclick = function () {
	                var e = event;
	                e.cancelBubble = true;
	                e.srcElement.previousSibling.checked = !e.srcElement.previousSibling.checked;
	                fChg.apply(e.srcElement.previousSibling);
	            }
	        });
	        var c;
	        for (var j = vc.cols.length - 1; j >= 0; j--) {
	            for (c = div.firstChild; c; c = c.nextSibling) {
	                if (c.tagName == 'INPUT' && c.value == vc.cols[j].name) { c.checked = true; break; }
	            }
	            if (!defined(c)) vc.cols.splice(j, 1);
	        }

	    }
	    div = appendChild(container, { tag: 'DIV', innerText: '', className: 'xBtn', style: 'top:2px;position:absolute;right:2px' });
	    div.onclick = function () {
	        var elm = this;
	        var p = elm.parentNode;
	        fireEvent(vc, 'ConfigEnd');
	    }
	}, onConfigEnd: function () { //close the dialog for configuration 
	    var vc = this, elm = event.srcElement;
	    var p = elm.parentNode; /* container div*/
	    // write back 
	    vc.state = null;
	    p.parentNode.removeChild(p);
	    vc.cube.loadData.apply(vc.cube);
	}, onShowCol: function (o) {
	    var i, h, vc = this;
	    var div, elm;
	    var tc = o.td;
	    if (tc && tc.firstChild) tc.removeChild(tc.firstChild);
	    vc.setState(); // = 'mc';
	    // vc.w each width
	    vc.w = Math.min(Math.round((tc.offsetWidth - 20) / vc.cols.length) - 8, 80);
	    h = tc.offsetHeight - 7;

	    var ul = appendChild(tc, { tag: 'UL', className: 'HDR' });
	    ul.style.height = (tc.offsetHeight - 8) + 'px';
	    ul.style.width = tc.clientWidth + 'px';
	    /* close botton at right-upper corner */
	    if (tc.tagName == 'TH') {
	        div = appendChild(tc, { tag: 'DIV', innerText: '', className: 'xBtn', style: 'top:2px;position:absolute;' });
	        div.style.left = (offset(tc).left + tc.offsetWidth - 24) + 'px';
	        div.onclick = function () {
	            event.cancelBubble = true;
	            var elm = this;
	            fireEvent(vc, 'HideCol');
	        }
	    }

	    var f = function () { event.cancelBubble = true; fireEvent(vc, 'DragInit'); };
	    for (i = 0; i < vc.cols.length; i++) {
	        elm = appendChild(ul, { tag: 'LI', innerText: vc.cols[i].name, style: 'width:' + vc.w + 'px;left:' + ((vc.w + 6) * i + 2) + 'px;' });
	        addEvent(elm, 'mousedown', f);
	        /* touch event */
	        //elm.ontouchStart = function (event) {event.cancelBubble=true; alert('here');}
	    }


	}, onHideCol: function () { /* 移動結束 div done clicked */
	    var vc = this, elm = event.srcElement;
	    var p = elm.parentNode;
	    vc.state = null;
	    vc.cube.loadData.apply(vc.cube);

	}, onDragInit: function () { /* when mouse click the item */
	    var vc = this, elm = event.srcElement;
	    vc.setState(elm);
	    elm.cxy = { x: event.clientX, y: event.clientY };
	    elm.hMove = function () { fireEvent(vc, 'Drag'); };
	    elm.hUp = function () { fireEvent(vc, 'DragEnd'); }
	    addEvent(elm, 'mousemove', elm.hMove);
	    addEvent(elm, 'mouseup', elm.hUp);
	    addEvent(elm, 'mouseout', elm.hUp);
	}, onDrag: function () {
	    var vc = this, elm = event.srcElement;
	    var c, i, off = (event.clientX - elm.cxy.x), w = Math.round(vc.w / 3);
	    elm.style.left = (elm.offsetLeft + off) + 'px';
	    elm.cxy = { x: event.clientX, y: event.clientY };
	    /* 檢查左右邊, overlap 程度 */
	    //p=elm.parentNode;
	    c = elm.previousSibling;
	    var p = elm.parentNode;
	    for (i = 0; i < p.childNodes.length; i++) { if (p.childNodes[i] == elm) break; }

	    if (c && (off < 0) && (c.offsetLeft + c.offsetWidth) - elm.offsetLeft > w) {
	        //	c.style.left = (c.style.left.toInt() + vc.w+6)+'px';
	        animate.apply(c, ['left', c.style.left.toInt() + vc.w + 6]);
	        p.removeChild(elm);
	        p.insertBefore(elm, c);
	        var tmp = vc.cols[i - 1];
	        vc.cols.splice(i - 1, 1);
	        vc.cols.splice(i, 0, tmp);
	    } else if (elm.nextSibling && off > 0) {
	        c = elm.nextSibling;
	        if ((elm.offsetLeft + elm.offsetWidth) - c.offsetLeft > w) {
	            animate.apply(c, ['left', c.style.left.toInt() - vc.w - 6]);
	            p.removeChild(c);
	            p.insertBefore(c, elm);
	            var tmp = vc.cols[i];
	            vc.cols.splice(i, 1);
	            vc.cols.splice(i + 1, 0, tmp);

	        }
	    }
	}, onDragEnd: function () {
	    var elm = event.srcElement, p = elm.parentNode;
	    var i = 0, vc = this;
	    removeEvent(elm, 'mouseup', elm.hUp);
	    removeEvent(elm, 'mousemove', elm.hMove);
	    for (var c = p.firstChild; c; c = c.nextSibling, i++) c.style.left = (i * (vc.w + 6) + 2) + 'px';
	    vc.state = 'none';

	}
	, setState: function (handle) {
	    var vc = this;
	    if (!defined(vc.state) || vc.state == 'dragend') {
	        vc.state = 'none';
	    } else if (vc.state == 'none') { vc.state = 'draginit'; }
	    else if (vc.state == 'draginit') {
	        vc.state = 'dragstart';
	        vc.handle = handle;
	    }
	    return vc.state;
	}, destroy: function () {
	    var vc = this;
	    vc.cube = null;
	    return null;
	}
    } /* end of vCol */
    var hCol = extendClass(vCol, {
        direction: 'horizontal',
        init: function (cube, cols) {
            var vc = this;
            vc.cube = cube;
            switch (typeof cols) {
                case 'object':
                    vc.cols = cols;
                    break;

                default:
                    if (defined(cols)) vc.cols = cols.slice(0, 0);
                    else vc.cols = [];
                    break;
            }
        }
    });

    /*+ parserIdx jTable.prototype.new(object) +*
    v.1.1 add createObject 
    jTable create by Jiantian-Lee 2011/10 version:1.0 
    options:
    #id(string): the table object id, id:'tb1' 將會create 一個id為 tb1 的table 
    #tblObj: HTMLTableElement 如果沒有設定id 值，則必須於<body> 文件內自行建立一個table，然後設定語法如下 tblObj: document.getElementById('tb1')
    #bodies[object]: optional table bodies to be create, 物件陣列 exp : [{id='bd1'},{id='bd2'}]
    #toolbar[object]: tool bar (call this.setToolBar(object) method) , please reference setToolBar method
    #header(object) :  設定表頭(tHead)欄位文字內容以及欄位寬度 
    ## colWidth:[integer]
    ## colsText:[string]}  
    */
    function jTable(options) {
        var defaultPlotOptions = { events: {} };
        var tb = this, t = extend({ toolbar: { pager: false, btn: [] }, id: '', className: 'mytable', bodies: [], type: 'jTable', colGroup: false
        }, deepExtend({ plotOptions: defaultPlotOptions, header: {} }, options));

        //if (t.type == 'cubeTable') { tb = new cubeTable(); }
        tb.type = t.type;
        switch (t.type) {
            case 'cubeTable':
                tb = new cubeTable();                
                break;
            case 'lazy-cube': //lazy-cube自行處理所有的rule
                t.colGroup = true;
                tb = new lazyCube(lazyCubeSetting, t.lazy);
                break;
        }

        if (options && (t.id || !defined(t.tblObj)) && DOC.body) {            
            if (t.id == "" || !defined(t.id)) t.id = 'tbl1';
            var tblStyle = t.colGroup === true ? 'table-layout:fixed;overflow:hidden;' : 'width:1000px;table-layout:fixed;overflow:hidden;';
            tb.tblObj = appendChild((t.parentNode) ? t.parentNode : DOC.body, { tag: 'TABLE', className: t.className, id: t.id, style: tblStyle});
            if (t.colGroup === true) {                
                tb.colGroup = new jElement({tag: 'colgroup'});
                tb.colGroup.appendTo(tb.tblObj);
            }            
            tb.tblObj.appendChild(DOC.createElement('THEAD'));
            tb.tblObj.appendChild(DOC.createElement('TFOOT'));
        }
        else if (tb.tblObj) tb.tblObj = t.tblObj;
        //else return tb;
        tb.options = options;

        if (tb.tblObj) tb.init(t);
        return tb;
    }
    /*+ parserIdx jTable.prototype.addBody(object) +*
    new version of createBody 
    options:
    o.idx(integer,-1) : insert before the body index into this table (-1:at the end) 
    o.id (string,'tb') : the id of the index 
    parserEnd*/

    jTable.prototype = {
        init: function (o) {
            var r, i, tb = this;
            tb.renderTo = tb.tblObj.parentNode;
            extend(tb.tblObj.style, o.style);                        
            tb.tHead = new jTbody({ tBody: tb.tblObj.tHead, parentNode: tb, post: {} });
            tb.tFoot = new jTbody({ tBody: tb.tblObj.tFoot, parentNode: tb, post: {} });
            tb.tBodies = [];
            tb.copyRight = "ver 2.1.0 by jiantian.lee@innolux.com 2011/10~2015/08/16";
            //if (o.header) {
            var s = getCookie('colsWidth' + tb.tblObj.id), w = [], rIdx;
            if (s.length > 0) w = s.split(',');
            if (!(defined(o.header.colsWidth)) || w.length == o.header.colsWidth.length) {
                each(w, function (v, i) { 
                	w[i] = v.toInt();
            	});
                
                tb.setColsWidth(w);
            } else if (o.header.colsWidth) tb.setColsWidth(o.header.colsWidth);
            if (o.header.colsText) rIdx = tb.tHead.createHeader(o.header.colsText, -1);
            if (defined(rIdx) && o.header.filter) {
                r = tb.tHead.rows[rIdx];
                r.filter = o.header.filter;
                r.onclick = function () {
                    var r = this, bd = r.parentNode.data.iTbody, e = event, cell = e.srcElement;
                    if (cell.tagName == 'SPAN') cell = cell.parentNode;
                    if (defined(cell, 'filterOption')) fireEvent(bd, 'FilterRowClick', { row: r, cell: cell });
                }
                each(r.filter.columns, function (v, i) {
                    var c = r.childNodes[v.cellIndex], backupText = c.innerText;
                    c.innerText = ''; /* 刪除重建SPAN可能會影響 原來 cell 的style */
                    var span = appendChild(c, { tag: 'SPAN', innerText: backupText, style: 'textDecoration:underline;cursor:pointer;' });
                    c.filterOption = extend({ renderTo: c, table: tb, method: r.filter.method }, v);
                });
            }
            tb.selRow = null;
            tb.toolbar = [];
            if (o.toolbar) tb.setToolBar(o.toolbar);
            for (i = 0; i < o.bodies.length; i++) tb.addBody(o.bodies[i]);
            tb.scrollX = false;
            tb.scrollY = false;
            tb.treeLayers = 0;
        },
        addBody: function (o) {
            var tbl = this, t = extend({ idx: -1, id: tbl.tblObj.id + '_bd' + tbl.tBodies.length }, o);
            var vtbody = document.createElement("TBODY");
            var n;
            if (tbl.type == 'treeTable') {
                n = new treeBody();
                n.init({ tBody: vtbody, parentNode: tbl, post: {}, colStyle: t.colStyle, cellUpdated: o.cellUpdated, plotOptions: t.plotOptions });
            } else if (tbl.type == 'cubeTable') {
                n = new cubeBody();
                n.init({ tBody: vtbody, parentNode: tbl, post: {}, colStyle: t.colStyle, cellUpdated: o.cellUpdated, plotOptions: t.plotOptions });

            } else n = new jTbody({ tBody: vtbody, parentNode: tbl, post: {}, colStyle: t.colStyle, cellUpdated: o.cellUpdated, plotOptions: t.plotOptions });
            n.tBody.id = t.id;
            if (t.idx < 0) { tbl.tblObj.appendChild(vtbody); tbl.tBodies.push(n); }
            else { tbl.tblObj.insertBefore(vtbody, tbl.tBodies[t.idx].tBody); tbl.tBodies.splice(t.idx, 0, n); }
            return n;
        },
        /*+ parserIdx create an table body
        replaced by addBody 2012/03/07 
        idxBefore: insert before the body which with index=idxBefore, if ixBefore=-1 then inserted as last one */
        createBody: function (idxBefore, bodyID) { return this.addBody({ idx: idxBefore, id: bodyID }); },
        createHeader: function (opt) {
            var tbl = this;
            if (!defined(opt)) opt = tbl.options.header;
            /* 2014/02 may change the options header format   
            from : {colsText:['col1','col2'], colsWidth:[200,300]}
            to  :{ col1: {width:200}, col2:{width:300, formatter:...,...}    }
            */
            if (defined(opt, 'colsText')) {
                if (tbl.tHead.rows.length == 0 && opt.colsWidth) tbl.setColsWidth(opt.colsWidth);
                tbl.tHead.createHeader(opt.colsText);

            }
            return tbl.tHead.tBody.lastChild;
        },
        destroy: function () {
            var n, tb = this;
            // fire the chart.destoy event fireEvent(tb, 'destroy');
            removeEvent(tb);
            tb.scrollBody({ state: false });
            var i = tb.tBodies.length;
            while (i--) tb.tBodies[i] = tb.tBodies[i].destroy();

            //each(tb.tBodies, function(bd,idx) {bd.destroy(); });
            if (tb.tHead) tb.tHead = tb.tHead.destroy();
            if (tb.tFoot) tb.tFoot = tb.tFoot.destroy();
            if (tb.tblObj) tb.tblObj.parentNode.removeChild(tb.tblObj);

            for (n in tb) { delete tb[n]; }
            return null;
        }, exportBody: function (bdIdx) {
            var bdId = pick(bdIdx, 0)
		, tbl = this
		, objExcel, objWorkbook
		, bd = tbl.tBodies[bdId];
            bd.curPage = 0;
            if (!defined(tbl.rowCount)) tbl.rowCount = bd.rows.length;
            if (tbl.mapPath)
                tbl.rowsPerPage = Math.max(window.prompt(" rows per page(500~" + tbl.rowCount + ")?", tbl.rowsPerPage), 500);
            for (var toRow = 0; toRow < tbl.rowCount; ) {
                toRow = Math.min(tbl.rowCount, (bd.curPage + 1) * tbl.rowsPerPage);
                if (tbl.mapPath)
                    tbl.gotoPage({ async: false, fromRow: bd.curPage * tbl.rowsPerPage + 1, toRow: toRow });
                bd.curPage += 1;
                var strCopy = "<head><title>Page " + bd.curPage + "</title></head><TABLE style='" + tbl.tblObj.style.cssText + "'>";
                for (var r = tbl.tHead.tBody.firstChild; r; r = r.nextSibling) {
                    strCopy += "<tr style='" + r.style.cssText + "'>" + r.innerHTML + "</tr>";
                }
                strCopy += bd.tBody.innerHTML;
                strCopy += "</TABLE>";
                if (defined(window.clipboardData)) { /* IE  */
                    try {
                        window.clipboardData.setData("Text", strCopy);
                        if (!defined(objExcel)) {
                            objExcel = new ActiveXObject("Excel.Application");
                            if (objExcel) { objExcel.visible = true; objWorkbook = objExcel.Workbooks.Add; }
                        }
                        if (objExcel) {
                            var objWorksheet = objWorkbook.Worksheets.Add;
                            objWorksheet.Name = "Page " + bd.curPage;
                            objWorksheet.Paste;
                        } 
                    }
                    catch (err) { alert(err.message); }
                } /* not IE */else {
                    var uriContent = "data:application/octet-stream," + encodeURIComponent(strCopy); //limit 256k, data:application/octet-stream
                    var newWindow = window.open(uriContent, 'page' + bd.curPage);
                }

            } /* end of all pages */
        }
, gotoPage: function (o) {
    var tbl = this
	, bd = pick(o.bd, tbl.tBodies[0]), f = pick(o.eachRow, function (d) { bd.insertRow({ data: d }); })
	, rpg = tbl.rowsPerPage, rc = tbl.rowCount, toRow = o.toRow, fromRow = o.fromRow;
    if (o.elm) {
        bd.curPage = Math.min(Math.max(0, bd.curPage + pick(o.elm.data, 1)), cMaxPageNo, Math.round(rc / rpg) + 1);
        toRow = Math.min((rpg) * (bd.curPage + 1), rc);
        fromRow = bd.curPage * rpg + 1;
        //o.toRow=l;	
    }
    if (lockAjax(true, tbl.tblObj, true)) {
        bd.removeAll(0);
        ajax({ url: g_URL + 'ajax/gotoPage.aspx', data: { dbSID: 'edwr13', fromRow: fromRow, toRow: toRow, mapPath: tbl.mapPath }
		, eachRow: f
		, async: pick(o.async, true)
		, success: function (d, sts, xmlHdr) {
		    tbl.setToolBar({ set: 'pager', fromRow: fromRow, toRow: toRow, rowCount: rc });
		    lockAjax(false, tbl.tblObj, false);

		}
		, error: function (xmlHdr, sts, resText) {
		    alert(sts);
		    lockAjax(false, tbl.tblObj, false);
		}
        });
    } else alert("wait for loading...page(" + (bd.curPage + 1) + ")");

}
        /*+ parserIdx jTable.prototype.insertCol(o) 
        className (string) Must : the className of the cell
        idx(integer) Must : the column idx to insert before, that is the new column idx
        parserEnd*/
, insertCol: function (o) {
    var i, s, tbl = this, elm = tbl.tblObj;
    var t = extend({ textAlign: 'center', toFixed: -1 }, o);
    var insertColumn = function (extendWidth) {
        var r = this;
        var c = DOC.createElement((r.parentNode.tagName == "THEAD") ? "TH" : "TD");
        c.style.width = t.width + 'px';
        if (defined(t.className)) c.className = t.className;
        r.insertBefore(c, r.childNodes[t.idx]);
        if (extendWidth) r.parentNode.parentNode.style.width = (r.parentNode.parentNode.style.width.toInt() + t.width) + 'px';
    }

    /* insert one column to hidden row */
    insertColumn.apply(tbl.tHead.rows[0], [true]);

    /* align both table objects if necessary */

    if (tbl.scrollY) { // && !tbl.scrollX) { 
        /* insert a column to the hidden row of bottom table header body */
        var wrapper = tbl.tblObj.parentNode;
        insertColumn.apply(tbl.tblObj.tHead.rows[0], [true]);
        wrapper.style.width = (wrapper.style.width.toInt() + t.width) + 'px'; /* wrapper */
        if (!tbl.scrollX && wrapper.nextSibling) {
            //var tblElement = tbl.tFoot.tBody.parentNode;
            wrapper.nextSibling.style.width = (wrapper.nextSibling.style.width.toInt() + t.width) + 'px'; //tbl.tblObj.parentNode.style.width;
        }
    }

    if (tbl.type == 'treeTable' || tbl.type == 'cubeTable') {
        for (var r = tbl.tHead.rows[1]; r; r = r.nextSibling) {
            if (r.firstChild) {
                r.firstChild.colSpan += 1;
                for (var skipRows = r.firstChild.rowSpan; r && skipRows > 1; skipRows--) r = r.nextSibling;
            }
        }
        for (var r = tbl.tFoot.rows[0]; r; r = r.nextSibling) r.firstChild.colSpan += 1;

        each(tbl.tBodies, function (bd, bdidx) {
            for (var r = bd.tBody.firstChild; r; r = r.nextSibling) {
                if (r.data.layer < tbl.treeLayers && r.childNodes.length > r.data.layer) r.childNodes[r.data.layer].colSpan += 1;
                else insertColumn.apply(r, [false]);

            }
        });

    } else {
        /* the rowSpan issue are too complicate you should insert all header rows here by yourself 
        bodies */
        for (i = 0; i < tbl.tBodies.length; i++) {
            for (j = 0; j < tbl.tBodies[i].rows.length; j++) {
                var r = tbl.tBodies[i].rows[j];
                c = document.createElement("TD");
                c.className = t.className;
                r.insertBefore(c, r.childNodes[t.idx]);
            } 
        }


    } /* not tree Table  */
}, print: function (jp) {
    var tbl = this;
    if (!tbl.scrollY) {
        jp.printElement(tbl.tblObj);
    } else if (!tbl.scrollX) { /* should reset scrollbody before print out and scroll again	*/
        var wrapper = tbl.tblObj.parentNode;
        var hdr = tbl.tHead.tBody.parentNode;
        var bak = wrapper.style.height;
        wrapper.style.height = l_tbMain.tblObj.offsetHeight + 'px';
        /* shift position */
        var bakLeft = hdr.style.left, bakTop = hdr.style.top.toInt();
        hdr.style.left = '0px';
        wrapper.style.left = '0px';
        hdr.style.top = '0px';
        wrapper.style.top = (wrapper.style.top.toInt() - bakTop) + 'px';
        jp.printElement(hdr, wrapper);
        wrapper.style.height = bak;
        hdr.style.left = bakLeft;
        wrapper.style.left = bakLeft;
        hdr.style.top = bakTop + 'px';
        wrapper.style.top = (wrapper.style.top.toInt() + bakTop) + 'px';


    }
},
        removeBody: function (tbodyID) { this.tblObj.removeChild(this.tBodies[tbodyID].tBody); this.tBodies.splice(tbodyID, 1); },
        reset: function () {
            var tbl = this;
            if (tbl.scrollY) tbl.scrollBody({ state: false });
            tbl.treeLayers = 0;
            tbl.tBodies[0].removeAll(0);
            tbl.tHead.removeAll(0);
            tbl.createHeader(tbl.options.header);
        },
        /*+ parserIdx jTable.prototype.scrollBody(object) +*
        範例1：上下凍結 tb.scrollBody({height:500}); 將table切成上面header 及下面body, foot 三塊，高度共500px
        中間body可以上下scroll 
        範例2：凍結儲存格第4欄 語法：tb.scrollBody({height:500, width:800, colIdx:4}); 
        凍結儲存格（表頭），讓表身body 可以scroll ex.scrollBody
        作法：1.新增一個div 包住原來table ,called wrapper, class=jInfo.clsName.wrapper
        2. 新增一個table 放在div 上面，將原來table head搬到新 table理, 
        3. 新增一個table 放在div 後（下) 面,將table Foot 搬到下面table 理
        4.設定其第一行寬度與原來表頭第一行一樣，
        param@object
        1. height(integer): setting the height (in px) of table 
        2. width(integer): optional, the width of table, 整個table的寬度 包含Y軸scroll bar寬度）
        3. colIdx(integer): width,colIdx是一組的需要同時存在, colIdx 表要凍結儲存格的column index，
        例如colIdx=4, 從column 4開始可以水平scroll, 凍結0~3 儲存格
        4. state(boolean,true) : enable scrolling or disable
        5. fixedBody:{style:object,colIdx:integer} , 水平scroll
        6. cloneHR(boolean) : for tree, cube 複製header的hidden row 到 body 
        PS. 本版本可scroll 上下，或scroll上下左右但不能只凍結左右
        parserEnd */
        scrollBody: function (o) {
            var tb = this
		  , clsName = ''
		  , elm
		  , i
		  , tbh, tbf /* create new table for foot body */
		  , th1r /* table head first row */
		  , tb1r = [] /* table bodies first row */
		 	, settings = extend({ width: null, height: 100, state: !tb.scrollX }, o)
			, sbHeight = 20 /* scrollbar height 20 px IE8 */
			, w = 0
			, wrapper; /* the div wrapper contain the table */

            if (!settings.state) { /* remove the wrapper 目前只有1維度，需再修改如果是2維 */
                var container = tb.tblObj.parentNode;
                tb.scrollY = false;
                /*  merge right side to left body, (number of rows should equal, rowSpan problem) */
                if (tb.scrollX) {
                    var divHR = tb.tHead.tBody.parentNode.nextSibling; // right side DIV
                    var pElm = divHR.parentNode;
                    var divBR = divHR.nextSibling.nextSibling;
                    var mergeBD = function (bdL, bdR) {
                        if (bdL.childNodes.length != bdR.childNodes.length) return;
                        var rl, rr, c, rSpan = 1;
                        for (rr = bdR.firstChild, rl = bdL.firstChild; rr && rl; rr = bdR.firstChild, rl = rl.nextSibling) {
                            for (c = rr.firstChild; c; c = rr.firstChild) rl.appendChild(c);
                            bdR.removeChild(rr);
                            /* if rowSpan > 1*/
                            if (rl.childNodes.length == 1 && rl.firstChild.rowSpan > 1) {
                                for (var i = 1; i < rl.firstChild.rowSpan; i++, rl = rl.nextSibling) {
                                    bdL.insertBefore(bdR.firstChild, rl.nextSibling);

                                }
                            }

                        }
                    }
                    mergeBD(tb.tHead.tBody, tb.tHead.tBody.neighbor);
                    pElm.removeChild(divHR);
                    mergeBD(tb.tBodies[0].tBody, tb.tBodies[0].tBody.neighbor);
                    pElm.removeChild(divBR);

                    tb.scrollX = false;
                }
                if (container.className == jInfo.clsName.wrapper) {
                    var tbl = tb.tBodies[0].tBody.parentNode, cp = container.parentNode;
                    //將中段,複製的tHead移除
                    if (tbl.tHead) tbl.removeChild(tbl.tHead);
                    //put tHead, tFoot back to original table 
                    tb.tblObj.insertBefore(tb.tHead.tBody, tb.tblObj.firstChild);
                    tb.tblObj.appendChild(tb.tFoot.tBody);
                    // reset tblObj position (left, top)
                    tb.tblObj.style.left = container.previousSibling.style.left;
                    tb.tblObj.style.top = container.previousSibling.style.top;
                    //remove the empty table on the top 
                    cp.removeChild(container.previousSibling);
                    //move the table out from container (wrapper)
                    cp.insertBefore(tb.tblObj, container);
                    cp.removeChild(container);
                }
                return;

            }

            wrapper = appendChild(tb.tblObj.parentNode, { tag: 'div', insBefore: tb.tblObj
  	, className: jInfo.clsName.wrapper, style: 'height:' + settings.height + 'px'
            });
            wrapper.appendChild(tb.tblObj);
            //settings.scrollbarWidth = jInfo.sbWidth;
            clsName = tb.tblObj.className;
            if (defined(o.style)) extend(tb.tblObj.style, o.style); /* 2012/10/30 setup table bodies style ex. {position:'absolute', left:'0px'} */
            tb.scrollY = true;

            /* 用table 實際表現出來的寬度 */
            var tableWidth = tb.tblObj.style.width.toInt();

            th1r = tb.tHead.tBody.firstChild;

            // 內縮將來上面thead with=tbodyW + wrappwer_sbW 包含在放在裡面
            // safari width 不包含左右border=1px

            /* 產生一個新的table 放在 原來table 上面 */
            tbh = appendChild(wrapper.parentNode, { tag: 'TABLE', insBefore: wrapper, className: clsName });
            /* 把原來table的表頭放到上面的table理 */
            tbh.appendChild(tb.tHead.tBody);

            tbh.style.cssText = tb.tblObj.style.cssText;
            tbh.style.position = 'absolute';
            tbh.style.left = (tb.tblObj.style.left == "") ? '0px' : tb.tblObj.style.left;
            tbh.style.top = (tb.tblObj.style.top == "") ? '0px' : tb.tblObj.style.top;
            //tbh.style.width=tableWidth + 'px'; /* table width must equal to the summary with of first-row columns width */
            tbh.style.height = tbh.offsetHeight + 'px';

            wrapper.style.height = Math.max(28, settings.height - tbh.offsetHeight) + 'px';
            wrapper.style.top = (tbh.style.top.toInt() + tbh.offsetHeight) + 'px';
            wrapper.style.left = tbh.style.left;
            tb.tblObj.style.left = "-1px";
            tb.tblObj.style.top = "0px";
            /* ceate an self defined scrollbar 
            var divSB=appendChild(document.body,{tag:'div',style:'position:absolute;width:4px;height:100px;zIndex:100;', innerText:'test'});
            divSB.style.backgroundColor='gray';
            divSB.style.left='100px';	
            duplicate tHead */
            var throw1 = appendChild(tb.tblObj, { tag: 'THEAD' }).appendChild(th1r.cloneNode(true));
            wrapper.style.width = (tableWidth - 2 + jInfo.sbWidth) + 'px'; /* left=-1 and border   */
            /* table foot */
            if (tb.tFoot.rows.length > 0) {
                tbf = appendChild(wrapper.parentNode, { tag: 'TABLE', insBefore: wrapper.nextSibling, className: clsName });
                tbf.appendChild(tb.tFoot.tBody);
                tbf.style.width = (tableWidth + 1) + 'px'; /* safari, toolbar column span */

                /* the height jof BODY(wrapper), should subst the height of table FOOT */
                wrapper.style.height = (wrapper.offsetHeight - tbf.offsetHeight) + 'px';
                tbf.style.position = 'absolute';
                tbf.style.left = tbh.style.left;
                tbf.style.top = (wrapper.style.top.toInt() + wrapper.offsetHeight) + 'px';
            }

            /* frozen column Index it will be more complicate to splite row when colSpan accurred 
            compare with old version 1.6 (colIdx) */
            if (defined(o.fixedBody) && defined(o.fixedBody.colIdx)) o.fixedIndex = o.fixedBody.colIdx;
            else o.fixedIndex = pick(o.fixedIndex, o.colIdx);

            if (defined(o.fixedIndex)) {
                tb.scrollX = true;
                var divHR /* the div wrapper to hold table header on top right */
		, divBR /* the div to hold right side table body */
		, divFR /* for foot */
		, tbhr
		, tbbr /* table body at rigth side */
		, tbfr;
                /* width of left-top corner DIV */
                w = th1r.childNodes[o.fixedIndex].offsetLeft;
                /* create a DIV right-top corner , for right side header */
                divHR = appendChild(wrapper.parentNode, { tag: 'div', insBefore: wrapper
  	, className: jInfo.clsName.wrapper, style: 'overflowY:hidden;overflowX:scroll;'
                });

                tbhr = appendChild(divHR, { tag: 'TABLE', className: clsName });
                tbhr.style.cssText = tb.tblObj.style.cssText;
                tbhr.style.overflow = '';
                tbhr.style.position = 'absolute';
                tbhr.style.left = '0px';
                tbhr.style.top = '0px';
                tbhr.style.height = ''; /* for IE6 can't set the height */
                tbhr.style.width = (tbh.style.width.toInt() - w) + 'px';
                divHR.style.left = w + 'px';
                divHR.style.top = tbh.style.top;
                divHR.style.width = Math.max(80, o.width - w - 2) + 'px'; /* no less then 80 */
                divHR.style.height = (tbh.offsetHeight + sbHeight) + 'px'; /* scrollBar height 20 pixel */
                /*  split body to left and right */
                var splitTable = function (bdLeft, tblRight, colIdx, w, fixedBody) {
                    var elm = appendChild(tblRight, { tag: bdLeft.tagName }); /* ie8 must contain a thead Section */
                    bdLeft.neighbor = elm;
                    elm.neighbor = bdLeft;
                    for (var r = bdLeft.lastChild; r; r = r.previousSibling) { /* split from last  row, incase change the column width */
                        var nr = r.cloneNode(false) /* check whether column span */
						, i = 0, rheight = r.offsetHeight;
                        if (jInfo.isIE && r.firstChild.rowSpan > 1) rheight = 30; /* offsetHeight is 30px at Safari, but IE8 60 when rowSpan */
                        while (i < colIdx && i < r.childNodes.length && r.childNodes[i].offsetLeft < (w - 1)) i++;
                        while (r.childNodes.length > i) nr.appendChild(r.childNodes[i]);
                        elm.insertBefore(nr, elm.firstChild);
                        /* when split it to tow rows, the height may diffenent, ex. Chinese ang English font height are different, set the higher one 
                        At IE6, should set the style.height of row element,default value is 'auto',or it will extend row height when cell width overflow)
                        to get the new offsetHeight, and then set style.height equal to offsetHeight again */
                        nr.style.height = rheight + 'px';
                        r.style.height = nr.style.height = Math.max(rheight, nr.offsetHeight) + 'px';
                        if (defined(fixedBody)) extend(r.style, fixedBody.style);

                    };

                }

                splitTable(tbh.tHead, tbhr, o.fixedIndex, w, null);

                tbh.style.width = w + 'px';

                /* 2014/04 for parentNode checking */
                if (tbh.parentNode != DOC.body) {
                    divHR.style.left = w + 'px';
                } else {
                    var offsetLeftTop = offset(tbh);
                    divHR.style.left = (offsetLeftTop.left + w) + 'px';
                }
                /* 2013/12  for box-sizing */
                tbhr.tHead.firstChild.style.height = '0px'; //hidden row
                //tbhr.tHead.firstChild.style.backgroundColor='black';

                /* create a new div for table right-side body */
                divBR = appendChild(wrapper.parentNode, { tag: 'div', insBefore: wrapper.nextSibling, className: jInfo.clsName.wrapper });
                tbbr = appendChild(divBR, { tag: 'TABLE', className: clsName });
                tbbr.style.cssText = tbhr.style.cssText;
                divBR.style.cssText = wrapper.style.cssText;
                divBR.style.left = divHR.style.left;
                divBR.style.width = divHR.style.width;  /* include scrollbar equal to upper header */

                wrapper.style.borderRight = 'none'; //width=w+'px';

                divBR.style.height = (wrapper.style.height.toInt()) + 'px';
                /* move all the bodies */
                each(tb.tBodies, function (bd, bdId) {
                    splitTable(bd.tBody, tbbr, o.fixedIndex, w, o.fixedBody);
                });
                /* move tHead hidden row */
                splitTable(tb.tblObj.tHead, tbbr, o.fixedIndex, w, o.fixedBody);
                tb.tblObj.style.width = tbh.style.width; /* left side body = left side header  */

                if (defined(tbf)) tbf.style.width = (o.width + 1) + 'px';
                /* 設定左右上下 div synch scroll top */
                wrapper.onscroll = function () { event.cancelBubble = true; this.nextSibling.scrollTop = this.scrollTop; };
                divBR.onscroll = function () {
                    var elm = this; event.cancelBubble = true;
                    elm.previousSibling.scrollTop = elm.scrollTop; /* left */
                    elm.previousSibling.previousSibling.scrollLeft = elm.scrollLeft; /* top */
                    if (elm.nextSibling && elm.nextSibling.nextSibling)
                        elm.nextSibling.nextSibling.scrollLeft = elm.scrollLeft; /* bottom */
                };

                divHR.onscroll = function () {
                    event.cancelBubble = true;
                    var tbh = this.nextSibling.nextSibling;
                    tbh.scrollLeft = this.scrollLeft; /* bottom body */
                    if (tbh.nextSibling && tbh.nextSibling.nextSibling) tbh.nextSibling.nextSibling.scrollLeft = this.scrollLeft; /* Foot */
                }
            } else {
                wrapper.style.overflowX = 'hidden';
            }
        },
        /*
        setting header columns onclick event 對該 column  排序
        o.col (HTMLTableCellElement) : 
        o.row(HTMLTableRowElelment) : if o.col is null 所有欄位都排序
        可以先設定該cell 的dataType='i' integer  or 's': string 'f': float
        */
        sortBody: function (o) {
            var r = o.row, c = o.col
  	, clsName = pick(o.clsName, jInfo.clsName.hdSortable)
  	, f = function () {
  	    var tbd, thead, c = this;
  	    event.cancelBubble = true;
  	    if (this.tagName.toUpperCase() == 'DIV') c = this.parentNode;
  	    thead = c.parentNode.parentNode.data.iTbody;
  	    c.adFlag = (c.adFlag == 'A') ? 'D' : 'A';
  	    c.lastChild.className = (c.adFlag == 'A') ? jInfo.clsName.hdSortedA : jInfo.clsName.hdSortedD;
  	    thead.parentNode.tBodies[0].sort({ cols: [c] });
  	    for (var c0 = thead.parentNode.tBodies[0].rows[0].firstChild; c0; c0 = c0.nextSibling) {
  	        var ch = thead.rows[0].childNodes[c0.cellIndex];
  	        c0.style.width = ch.style.width;
  	        ch = c.parentNode.childNodes[c0.cellIndex];
  	        if (ch != c && ch.sortable && ch.lastChild) ch.lastChild.className = jInfo.clsName.hdSortable;

  	    }
  	}
            if (!defined(c) && defined(o.row)) c = o.row.firstChild;

            for (; c; c = c.nextSibling) {
                var elm = appendChild(c, { tag: 'div', className: clsName });
                elm.style.left = (c.offsetLeft + c.offsetWidth - 12) + 'px';
                elm.onclick = f;
                c.onclick = f;
                c.sortable = true;
                if (c == o.col) break;
            }
        }
        /*+ parserIdx jTable.prototype.setAttributes(object) +*
        o.hdr...
        parserEnd*/
, setAttributes: function (o) {
    var i, s, t = extend({ selRow: [], hdr: this.tHead.tBody.lastChild }, o);
    for (i = 0; i < t.hdr.childNodes.length; i++) {
        s = 'col' + String(i);
        t.hdr.childNodes[i].id = s;
        t.hdr.childNodes[i].onclick = null;
    }
}
        /*+ parserIdx jTable.prototype.setColsWidth +*
        set the table width of each column
        insert row to tHead and set it column width
        如果tHead沒有 rows=0 會新增一行hiddend row,而且 table width = sum(cols width) +1 
        否則只是重新設定各欄位寬度此時
        #str 是個int array, ex. str=[21,21,300,300] 
        #str : array, if ['atuo'], auto
        ['resize','100%'] : full table
        ['resize','98%'] : resize to table width * 98% 
        return the number of columns created 
        parserEnd */
, setColsWidth: function (str) {
    var i, tr, th, cellWidth, tbl = this;
    var ttl = 0, w;
    var ratio = 1.0, winWidth = parseInt(document.body.offsetWidth, 10);
    var tblWidth = tbl.tblObj.style.width.toInt();
    var maxFS = (navigator.platform == 'iPhone') ? 64 : 18;
    if (tbl.tHead.tBody.childNodes.length > 0) {
        tr = tbl.tHead.tBody.firstChild;
        if (str[0] == 'resize' & str.length > 1) {
            if (str[1].substr(str[1].length - 1, 1) == '%') winWidth = Math.round(winWidth * parseInt(str[1], 10) / 100);
            else winWidth = str[1].toInt();
            ratio = (tblWidth == 0) ? 1.0 : winWidth * 1.0 / tblWidth * 1.0;
            var fs = isNaN(parseInt(tbl.tblObj.style.fontSize, 10)) ? 11 : parseInt(tbl.tblObj.style.fontSize, 10);
            tbl.tblObj.style.fontSize = Math.max(11, Math.min(maxFS, Math.round(ratio * fs))) + 'px';
        }
        for (th = tr.firstChild, i = 0; th; th = th.nextSibling, i++) {
            if (str[0] == 'auto') w = (th == tr.lastChild) ? tbl.tblObj.style.width.toInt() - th.offsetLeft : th.nextSibling.offsetLeft - th.offsetLeft; //(tr.childNodes[i]).innerWidth();
            else if (str[0] == 'resize') w = Math.round(th.style.width.toInt() * 1.0 * ratio);
            else if (i < str.length) w = str[i];
            if (isNaN(w)) w = Math.round(winWidth / tr.childNodes.length);
            cellWidth = (typeof (w) == 'number') ? w : w.toInt();
            th.style.width = cellWidth + "px";
            ttl += cellWidth;
        }
    }
    else { /* create one row */
        tr = appendChild(tbl.tHead.tBody, { tag: 'TR', className: jInfo.clsName.defHidden });
        for (i = 0; i < str.length; i++) { appendChild(tr, { tag: 'TH', style: 'width:' + str[i] + 'px' }); ttl += parseInt(str[i], 10); }
        tbl.headerRowCount = (tbl.headerRowCount) ? tbl.headerRowCount + 1 : 1;
    }
    if (ttl > 0) tbl.tblObj.style.width = (ttl) + "px"; /* box-border include left right border */
    return i;
}

        /*+ parserIdx jTable.prototype.setColWidth(
        idx(integer) : the column index
        w(integer) : the width of the column in pixel
        parserEnd */
, setColWidth: function (idx, w) {
    var tbl = this;
    var s = tbl.tHead.tBody.firstChild.childNodes[idx].style.width;
    var dX = w - s.toInt();

    if (tbl.scrollY && !tbl.scrollX) {
        var r = tbl.tblObj.tHead.firstChild, container = tbl.tblObj.parentNode;
        // HEADER
        var htb = container.previousSibling;
        htb.style.width = (htb.style.width.toInt() + dX) + 'px';
        htb.tHead.firstChild.childNodes[idx].style.width = w + 'px';
        // BODY
        r.childNodes[idx].style.width = (r.childNodes[idx].style.width.toInt() + dX) + 'px';
        tbl.tblObj.style.width = (tbl.tblObj.style.width.toInt() + dX) + 'px'; // table object
        container.style.width = (container.style.width.toInt() + dX) + 'px'; //container DIV
        //TFOOT
        container.nextSibling.style.width = (container.nextSibling.style.width.toInt() + dX) + 'px';
    } else {
        tbl.tblObj.style.width = (tbl.tblObj.style.width.toInt() + dX) + 'px';
        tbl.tHead.tBody.firstChild.childNodes[idx].style.width = w + 'px';

    }


}
        /*
        thr: table header row to align
        tbr: table body first row
        */
, alignColsWidth: function (thr, tbr) {
    var c, c0, hr0 = pick(thr, this.tHead.rows[0]), r0 = pick(tbr, this.tBodies[0].rows[0]);
    if (r0 && hr0) for (c0 = r0.firstChild, c = hr0.firstChild; c; c = c.nextSibling, c0 = c0.nextSibling) {
        c0.style.width = c.style.width;
    }
}
        /*+ parserIdx jTable.prototype.setToolBar +*
        set the tool bar at table Foot 
        # o.create(boolean,true) : creat one row at table Foot or don't, default=true
        # o.idx(int,-1) : the row index of toolbar default=-1, at the bottom or insert before 
        # o.resizeable(boolean,false) : show the resizeable button
        # o.body(jTbody,this.tFoot) : jTbody, default=tFoot
        # o.hideCR(boolean,false) : hide the copy right image
        # o.set (string) : the action set=insert,create or info, 3 type impllement at ver 1.2 
        #o.btn([object]): object array, ex [{cls:'GMToolReload' className, f: function(click), value:'', type:'button' }] 
        parserEnd*/
, setToolBar: function (o) {
    var i, r, b, td, tbl = this;
    var t = extend({ idx: -1, create: true, set: 'create', body: tbl.tFoot, btn: [], pager: true }, o);
    if (t.pager && t.set !== 'insert')
        t.btn = t.btn.concat([{ cls: jInfo.clsName.tbPager + 'First', data: cMinPageNo }, { cls: jInfo.clsName.tbPager + 'Prev', data: -1 },
	{ cls: jInfo.clsName.tbPager + 'Next1', data: 1 }, { cls: jInfo.clsName.tbPager + 'Last1', data: cMaxPageNo }, { cls: jInfo.clsName.tbPager, data: 0}]);
    var w = parseInt(tbl.tblObj.style.width, 10) / 3;
    if (t.set == 'info' && tbl.toolbar.length > 0) {
        var pg = getElement(tbl.toolbar[0], { v: 'JTInfo', by: 'className' }); //bug: scrollBody之後this.toolbar 會找不到物件
        if (pg === null) {
            var btn = appendChild(tbl.toolbar[0], { tag: 'input', type: 'text', id: 'JTInfo', className: 'JTInfo', value: t.info });
            if (defined(t.style)) extend(btn.style, t.style);
            return true; /* ture : set the info */
        }
        else {
            if (pg.value == t.info) return false; /* false : didn't updated the info */
            else pg.value = t.info;
            return true;
        } 
    }
    /* insert a toolbar row into t.body */
    if (t.set == 'create' || t.set == 'insert') {
        var btn;
        if (t.set == 'create' || tbl.toolbar.length == 0) {
            r = document.createElement('TR');
            if (t.idx < 0 || t.body.rows.length <= t.idx) t.body.tBody.appendChild(r); /* idx<0 放最後一行 */
            else t.body.tBody.insertBefore(r, t.body.tBody.rows[t.idx]);
            var cols = (tbl.tHead.rows.length > 0) ? tbl.tHead.tBody.firstChild.childNodes.length : 1;
            td = DOC.createElement('TD');
            td.colSpan = Math.max(1, cols);
            td.className = (t.hideCR) ? 'JToolBar JToolBarN' : 'JToolBar';
            //else td.td.style.backgroundImage='none'; //'url()'; /* remove the copy right background image */
            r.appendChild(td);
            if (!defined(tbl.toolbar)) tbl.toolbar = new Array();
            tbl.toolbar.push(td);
        }
        else td = tbl.toolbar[0];
        for (var iP = 0, i = 0; i < t.btn.length; i++) {
            var tmp = extend({ tag: 'INPUT', className: 'GMDefault', onclick: toolbarClick }, t.btn[i]);
            if (t.btn[i].tagName) tmp.tag = t.btn[i].tagName.toUpperCase();
            if (tmp.tag == 'INPUT' && t.btn[i].type === undefined) tmp.type = 'button';
            if (t.btn[i].cls) tmp.className = t.btn[i].cls;
            if (t.btn[i].f) tmp.onclick = t.btn[i].f;
            if (t.btn[i].idx !== undefined && t.btn[i].idx != -1) tmp.insBefore = td.childNodes[t.btn[i].idx];
            btn = appendChild(td, tmp); //appendChild(b
            setData(btn, 'tb', tbl);
            setData(btn, 'state', false);
            if (btn.className && btn.className.length > 0) {
                if (btn.className.substr(0, jInfo.clsName.tbPager.length) == jInfo.clsName.tbPager) {
                    if (btn.data) setData(btn, 'data', btn.data);
                    btn.style.left = (btn.parentNode.parentNode.offsetWidth / 2 + 25 * (iP++ - 2)) + 'px';
                    if (btn.className == jInfo.clsName.tbPager) {
                        btn.value = 'Showing from ~ to of ttl entries';
                        btn.id = 'GMToolPager';
                    } else {
                        btn.onclick = function () {
                            var elm = pick(event.target, this);  /* IE6 have no event.target */
                            event.cancelBubble = true;
                            if (elm) elm.style.cursor = 'wait';
                            tbl.gotoPage({ elm: elm });
                            elm.style.cursor = 'hand';
                        };
                    }
                } /* pager */else if (btn.className == jInfo.clsName.tbExport) {
                    btn.onclick = function (event) { tbl.exportBody(0); };
                } /* tbExport */
            } /* if btn.className */
        }
        return btn;
    }
    /* undate the toolbar */
    else if (tbl.toolbar.length > 0 && t.set == 'pager') {
        /* reset colspan of toolbar */
        if (t.tbCols) tbl.toolbar[0].colSpan = t.tbCols;
        /* reset the pager */
        var pg = getElements(tbl.toolbar[0], { v: jInfo.clsName.tbPager, by: 'className' });
        var l = Math.min(t.toRow, t.rowCount);

        if (pg.length == 1) pg[0].value = 'Showing ' + t.fromRow + ' to ' + l + ' of ' + t.rowCount + ' entries';
        if (!defined(tbl.tBodies[0].curPage)) tbl.tBodies[0].curPage = 0;
        /* disable the next btns  */
        each(tbl.toolbar[0].childNodes, function (elm, i) {
            var s = elm.className;
            if (s.search(jInfo.clsName.tbPager) >= 0) {
                if (s.search('Next') >= 0) elm.className = (t.rowCount <= t.toRow) ? jInfo.clsName.tbPager + "Next" : jInfo.clsName.tbPager + "Next1";
                else if (s.search('Last') >= 0) elm.className = (t.rowCount <= t.toRow) ? jInfo.clsName.tbPager + "Last" : jInfo.clsName.tbPager + "Last1";
                else if (s.search('Prev') >= 0) elm.className = (t.fromRow > 1) ? jInfo.clsName.tbPager + "Prev1" : jInfo.clsName.tbPager + "Prev";
                else if (s.search('First') >= 0) elm.className = (t.fromRow > 1) ? jInfo.clsName.tbPager + "First1" : jInfo.clsName.tbPager + "First";
                elm.disabled = !(elm.className.charAt(elm.className.length - 1) == '1');
            }
        });

        if (tbl.scrollX || tbl.scrollY) tbl.alignColsWidth(null, tbl.tBodies[0].rows[t.fromRow - 1]);

        return true;
    }
    else return false;

}

        /*
        mandatory parameter
        1. renderTo : HTMLElement (通常為 tHead某個cell欄位）
        optional
        1. data : array of string, filter 內容，default 抓取tBody 中renderTo 相對應欄位(cellIndex)的distinct innerText
        */

, getCellIndex: function (cell) {
    var c, tb = this;
    for (c = tb.tHead.rows[0].childNodes[cell.cellIndex]; c; c = c.nextSibling) {
        if (c.offsetLeft == cell.offsetLeft) return c.cellIndex;
    }
    return null;
}
        /*
        cIdx = the cell index of 第 0 行，第0行不能隱藏
        r = the row with the cell which with the same offsetLeft  
        delta : -1：往左找, 1： 往右找 
        */
, getCell: function (r, cIdx, delta) {
    if (!defined(delta)) delta = 0;
    var tb = this, offLeft = r.parentNode.parentNode.tHead.firstChild.childNodes[cIdx].offsetLeft;
    var idx = cIdx + delta;

    if (idx >= 0 && cIdx + delta < r.childNodes.length) {
        if (r.childNodes[idx].offsetLeft == offLeft) return r.childNodes[idx];
        else if (r.childNodes[idx].offsetLeft < offLeft) return tb.getCell(r, cIdx, delta + 1);
        else return tb.getCell(r, cIdx, delta - 1);
    }
    else if (cIdx + delta < 0) { // if scrollBody 往左邊body 找
        return r.childNodes[0];
    } else { //往右邊body找
        return r.childNodes[r.childNodes.length - 1];
    }

}

    } /* end of jTable */

    var cubeTable = extendClass(jTable, {
        type: 'cubeTable',
        _measures: [],
        _maxVColumns: 4,
        init: function (o) {
            var i, j, cube = this;
            cube.options.header = deepExtend({ colsText: [o.name] }, o.header);
            jTable.prototype.init.apply(cube, [o]);
            if (!defined(o.vCol)) o.vCol = [];
            cube._maxVColumns = pick(o.table.maxVColumns, 4);
            //var off=offset(cube.container);
            //if (!defined(o.cube.width)) o.cube.width= DOC.body.clientWidth-off.left-2;
            //if (!defined(o.cube.height)) o.cube.height=DOC.body.clientHeight-off.top-2;

            //cube.container.style.width = o.cube.width + 'px';
            //cube.container.style.height = o.cube.height + 'px';		
            /* 2 header rows */
            //tblOpt.parentNode = cube.container;	
            // replace the first column text with cube.title
            //	tblOpt.header.colsText.splice(0,1,o.title.text); 
            //	if (o.title.width) tblOpt.header.colsWidth.splice(0,1,o.title.width);	
            //cube.table = new jTable(tblOpt);	

            //var td=tbl.toolbar[0].firstChild; 
            var btn = cube.setToolBar({ set: 'insert',
                btn: [{ tag: 'INPUT', type: 'button', value: '', className: 'JTBtnDown', style: 'position:absolute;right:5px;left:auto;top:auto;bottom:4px;',
                    f: function () {
                        event.cancelBubble = true;
                        var elm = this;
                        fireEvent(cube.vCol, 'ConfigCol');
                    }
                }]
            });


            //extend(cube.table,tblOpt);	
            //cube.table.cube = cube;
            //extend(cube,o.cube);
            //body.plotOptions = o.plotOptions;

            cube.vCol = new vCol(cube, pick(o.vColumns, o.vCol));
            if (defined(o.hCol)) {
                cube.hCol = new hCol();
                cube.hCol.init(cube, o.hCol);
            }
            cube._measures = [];
            if (defined(o.header.measures)) {
                var measures = o.header.measures;
                for (var k in measures) {
                    cube._measures.push({ name: k, showName: pick(measures[k].name, k), width: pick(measures[k].width, 80)
					, aggregate: pick(measures[k].aggregate, function (ret, strValue) { return ret + String(strValue).toFloat(); })
                    });
                }
            }
            var defCubeAjaxOpt = {
                url: (cube.options.url) ? cube.options.url : cube.options.name + '.aspx',
                crossTab: function (d) {
                },
                data: {},
                success: function (d, txt, xhr) {
                    var cube = xhr.srcObject;
                    cube.resetColumn(d, xhr);
                    cube.insertData(d, xhr);
                }, error: function (xhr, sts, txt) {
                    alert(sts);
                }, onready: 'Load'
            };
            var defPlotOptions = { measures: { width: 70 },
                rows: {
                    formatter: function (cube) {
                        var c, r = this, startIndex = r.data.layer;
                        if (cube.scrollX) {
                            r = cube.tBodies[0].tBody.neighbor.childNodes[r.sectionRowIndex];
                            startIndex = 0;
                        }
                        for (c = r.childNodes[r.data.layer]; c; c = c.nextSibling) c.innerText = addCommas(c.innerText, 3);
                    }
                }
            };
            cube.options.ajaxOptions = deepExtend(defCubeAjaxOpt, cube.options.ajaxOptions);
            cube.options.plotOptions = deepExtend(defPlotOptions, cube.options.plotOptions);
            return cube;
        } /* init cube table */,
        insertData: function (d, xhdr, bd) { /* call back function of ajax loadData when success, insert data into cube.table.bd */
            var mc = [], fun = [], r, i, j, l, ttlLen, cube = this;
            if (!defined(bd)) bd = cube.tBodies[0];
            l = cube.vCol.cols.length;
            ttlLen = cube.tHead.rows[0].childNodes.length;
            if (cube.hCol && xhdr.getResponseHeader('queryLanguage') != 'MDX') {
                if (cube.crossTab != false) {
                    var defCT = { sort: true, xCols: [], yCol: l, measures: [] };
                    for (i = 0; i < defCT.yCol; i++) defCT.xCols.push(i);
                    for (j = 0; j < cube._measures.length; j++) defCT.measures.push(i + j + cube.tHead.rows.length - 2);
                    d.crossTab(defCT.xCols, defCT.yCol, ttlLen, function (dd, o) {
                        var a = this, val, i, j, ret = 0, ttl = o.ttl - o.yCol - o.hCol.length + 1;
                        for (i = 0; i < o.hCol.length; i++) {
                            val = dd[o.yCol + i];
                            ttl = ttl / o.hCol[i].value.length;
                            for (j = 0; j < o.hCol[i].value.length; j++) { if (val == o.hCol[i].value[j]) break; }
                            if (j == o.hCol[i].value.length) j--;
                            ret += j * ttl;
                        }
                        for (i = 0; i < o.ml; i++) a[ret + o.yCol + i] = dd[o.yCol + o.yl + i];
                    }, { hCol: cube.hCol.cols, ml: cube._measures.length });
                }
                var ttl = [];
                for (var i = l; i < ttlLen; i++) {
                    mc.push(i);
                    ttl.push(0);
                }
                for (var i = 0; i < d.length; i++) {
                    var cr = bd.insRow({ data: d[i], className: jInfo.clsName.treeRow });
                    each(mc, function (v, j) { ttl[j] += String(d[i][v]).toFloat(); });
                }

                bd.groupRows({ cols: l - 1, gcClass: 'JTC', sumNode: true, fs: false, mc: mc }); /* summary node */
                ttl.splice(0, 0, 'Total', '+c' + cube.vCol.cols.length + 1);

                r = jTbody.prototype.insertRow.apply(bd, [{ data: ttl, className: jInfo.clsName.treeRow}]);

                r.data = { layer: 0 };
            } 
            else if (d.length > 0 && xhdr.getResponseHeader('rowCount') > 0) {
                for (var i = 0; i < d.length; i++) {
                    var r = bd.insRow({ data: d[i], className: jInfo.clsName.treeRow });
                    r.childNodes[l - 1].onclick = function () {
                        var c = this; fireEvent(c.parentNode.parentNode.data.iTbody, 'TNClick');
                    }
                }
                // insert summary row	  
                for (j = 0, i = l; i < bd.rows[0].childNodes.length; i++) {
                    mc.push(i);
                    fun.push(cube._measures[j].aggregate);
                    if (++j >= cube._measures.length) j = 0;
                    //fun.push( function(r,i) {return r+String(i).toFloat();}); 
                }

                bd.sumCol({ mc: mc, className: jInfo.clsName.treeRow + '5', f: fun });
                r = bd.tBody.lastChild;
                r.firstChild.innerText = 'Total';
                r.firstChild.className = jInfo.clsName.treeNode;
                r.data = { layer: 0 };
                while (r.childNodes.length > bd.rows[0].childNodes.length) r.removeChild(r.lastChild);
                r.lastChild.className = jInfo.clsName.treeCell + 'R'; // 

                // gropu by, mc: measure columns, tId: to row index (length-2 exculde total row)

                bd.groupRows({ cols: l - 1, mc: mc, sumNode: true, fs: false, gcClass: 'JTC', tId: bd.rows.length - 2, f: fun }); // group by columns -1 
                r.firstChild.colSpan = l; //bd.rows[0].firstChild.colSpan;

                for (i = l; i > 1 && r.childNodes.length >= i; i--) r.removeChild(r.childNodes[i - 1]);

            } else alert("no data found!");
        },
        /* load data into cube (ajax called back) 
        issued from 
        1. cube.init (load all)
        2. cube.onConfig or hideCol (reload all)
        3. drillDown (with row parameter defined)
        */
        loadData: function (options, row) {
            var cube = this, s = '';
            var ajaxOpt = deepExtend({}, cube.options.ajaxOptions);
            if (defined(row)) {
                row.drillDown = false;
                row.childNodes[row.data.layer].className = jInfo.clsName.treeE;
                extend(ajaxOpt.data, options);
                ajaxOpt.data.info = 'drillDown';
                ajaxOpt.onready = 'DrillDown'; /* onDrillDown function */
                ajaxOpt.success = function (d, sts, xhr) {
                    var cube = xhr.srcObject, formatter = cube.options.plotOptions.rows.formatter;
                    each(d, function (dt, i) {
                        if (dt && dt.length > row.data.layer + 1) {
                            var r = cube.tBodies[0].insertRow({ data: dt, parentNode: row, formatter: formatter });
                        }
                    });

                }
            } else {
                cube.reset();
            }
            //first time may hasn't set group cols, so should modify the header column when data onLoaded 
            if (cube.filter) {
                if (typeof (cube.filter.data) == 'function') extend(ajaxOpt.data, cube.filter.data.apply(cube.filter, [cube]));
                else if (typeof (cube.filter.data) == 'object') extend(ajaxOpt.data, cube.filter.data);
            }
            ajaxOpt.data.verticalColumn = cube.vCol.toString();

            if (defined(cube.hCol)) ajaxOpt.data.horizontalColumn = cube.hCol.toString();
            ajax.apply(cube, [ajaxOpt]);
        },
        onDrillDown: function (xhdr) {
            var cube = this;
            var tblHeight = cube.options.table.height;
            if (!cube.scrollY && cube.tblObj.offsetHeight > tblHeight) {
                cube.scrollBody({ height: tblHeight, state: true });
            }
        },
        onLoad: function (xhdr) { /* when data loaded */
            /* formatter addCommas may use cube.plotOptions.formatter */
            var cube = this, bd = cube.tBodies[0], plotOptions = cube.options.plotOptions;

            for (var r = bd.rows[0]; r; r = r.nextSibling) {
                if (!defined(r.data)) continue;
                plotOptions.rows.formatter.apply(r, [cube]);
                if (r.data.layer == cube.treeLayers - 1) {
                    r.style.cursor = 'pointer';
                    r.onclick = function () {
                        var r = this, bd = r.parentNode.data.iTbody;
                        var e = event;
                        e.cancelBubble = true;
                        fireEvent(bd, 'RowClick', { row: r });
                    }
                } else r.drillDown = true;
            } /* for all rows */
            vCol.prototype.init.apply(cube.vCol);
            // bug: horizontal scroll 
            var tblOptions = cube.options.table;
            if (cube.tblObj.offsetHeight > tblOptions.height || (tblOptions.width && cube.tblObj.offsetWidth > tblOptions.width)) {
                var opt = { height: tblOptions.height, state: true };
                if (tblOptions.width && cube.tblObj.offsetWidth > tblOptions.width) {
                    opt.width = tblOptions.width;
                    opt.fixedIndex = cube.treeLayers;
                }
                //if (cube.tblObj.offsetWidth > cube.width) 
                //cube.scrollBody({height:cube.height,width:cube.width,state:true,cloneHR:true,fixedBody:{colIdx:cube.vCol.cols.length+1} });
                //else 
                cube.scrollBody(opt);
            }
        }, // end of onload
        resetMeasure: function (arrayMea) {
            //var arrayMea = strMeasure.split(
            var i, cube = this, measures = cube._measures;
            for (i = 0; i < arrayMea.length; i++) {
                if (measures.length > i) {
                    measures[i].name = arrayMea[i];
                    if (!defined(measures[i].width)) measures[i].width = 70;
                    if (!defined(measures[i].showName)) measures[i].showName = measures[i].name;
                } else {
                    measures.push({ name: arrayMea[i], showName: arrayMea[i], width: 80 });
                }
            }
            while (measures.length > arrayMea.length) measures.pop();
            if (measures.length == 0) measures.push({ name: 'qty', showName: arrayMea[i], width: 80 });
            return measures;

        },
        /* callback function
        initial load called from ajax.success (dafault ajaxOption) 
        */
        resetColumn: function (d, xhr) {
            var cube = this, cw = [], vCol = cube.vCol, s = xhr.getResponseHeader('groupColumn');
            while (vCol.cols.length > 0) vCol.cols.pop();
            if (defined(s) && s != "") vCol.vCols = decodeURIComponent(s); //IE8 s == "" default 
            s = xhr.getResponseHeader('verticalColumn');
            if (defined(s) && s != "") {
                var w = decodeURIComponent(s).split(',');
                each(w, function (v, i) { vCol.cols.push({ name: v }); });
            }
            s = xhr.getResponseHeader('measure');

            if (s != null && s != "") cube.resetMeasure(decodeURIComponent(s).split(','));
            else cube.resetMeasure([]);


            var isCT = (defined(cube.hCol)), l = cube.vCol.cols.length;

            if (xhr.getResponseHeader('queryLanguage') == 'MDX') {
                var hdrCol = d[0];
                d.splice(0, 1);
                if (cube.hCol) cube.hCol = cube.hCol.destroy();
                cube.hCol = new hCol();
                cube.hCol.init(cube);
                for (i = l; i < hdrCol.length; i++) {
                    var j, k, ar = hdrCol[i].split(".&"); /* ar.Length= hDimensions + 1 (Measure) */
                    for (j = 1; j < ar.length; j++) {
                        if (i == l) cube.hCol.cols.push({ value: [] });
                        k = String(ar[j]).search(/\./);
                        if (k > 0) {
                            var val = ar[j].substr(0, k);
                            if (cube.hCol.cols[j - 1].value.indexOf(val) < 0) cube.hCol.cols[j - 1].value.push(val);
                        }
                    }
                }
                isCT = false;
            }

            var isxxx = (isCT || xhr.getResponseHeader('queryLanguage') == 'MDX') && cube.hCol.cols.length > 0;
        },
        postResetColumn: function () {
            var cube = this
              , cubeHeader = [cube.options.header.colsText[0]]
              , cw = []
              , l = cube.vCol.cols.length
              , headerSpan = 0
              , ttlLen
              , ttl
              , hColLength
              , i
              , j
              , d0
              , ml = cube._measures.length
              , tmps = []
              , tmp = [];
            

            cube.tHead.removeAll(0);
            var $tHeadRow;
            $tHeadRow = $('<tr/>');



            cubeHeader.push('+c' + (l));
            //for (i = 0; i < l - 1; i++) //cw.push(21);
                //cw.push(200); //cube first column width width
            for (i = 0; i < l; i++) {
                cw.push(100);
                headerSpan++;
            }
            
            cubeHeader.push('+c' + headerSpan);

            

            hColLength = cube.hCol.cols.length;
            d0 = cube.hCol.cols[0].value;
            
            //ttl: hCol 各層最後的總長度, ml: measure length
            for (i = 0, ttl = 1; i < hColLength; i++)
                ttl *= cube.hCol.cols[i].value.length;
            
            ttlLen = ttl * ml + l;//l: 左邊為vCol的column個數


            for (var k = 0; k < hColLength; k++) {
                d0 = cube.hCol.cols[k].value;
                for (i = 0; i < d0.length; i++) {
                    j = (ttl / d0.length) * ml;
                    tmp = tmp.concat([d0[i], '+c' + j]);
                    if (k == 0) {
                        for (var idx = 0; j > 0; j--) {
                            cw.push(cube._measures[idx].width);
                            if (++idx >= cube._measures.length) idx = 0;
                        }
                    }
                }
                tmps.push(tmp);
                tmp = [];
                ttl = ttl / d0.length;
            }

            var mea = [];
            each(cube._measures, function (v, idx) { mea.push(v.showName); });
            tmps.push(mea);

            cubeHeader.splice(1, 0, '+r' + (hColLength));

            cube.tHead.removeAll(0);
            cube.setColsWidth(cw);
            cube.tHead.createHeader(cubeHeader.concat(tmps[0]));
            cube.tHead.rows[1].firstChild.className += ' cubeHeaderLeftTop';
            cubeHeader.splice(1, 1);
            
            for (j = 1; j < tmps.length; j++) {
                var tmp = tmps[j].slice(0, tmps[j].length);
                for (i = 1; i < tmps[j - 1].length / 2; i++) tmps[j] = tmps[j].concat(tmp);
                /* measure rows */
                if (j == tmps.length - 1) {
                    tmps[j].splice(0, 0, cube.vCol.toString().replace(/,/ig, ' '), '+c' + (l));
                }
                cube.tHead.createHeader(tmps[j], -1);
            }
            
            cube.tFoot.rows[0].firstChild.colSpan = cube.tHead.rows[0].childNodes.length;  //r.childNodes.length;
        }
    });

    function lazyCubeSetting() {
        var _private = 
        {
            a: 'i am a',
            colGroup: $('<colGroup/>'),
            raws: undefined
        };
        

        var ret =
		{
            init: function(o) {
                var i, j, cube = this;
                cube.options.header = deepExtend({ colsText: [o.name] }, o.header);
                jTable.prototype.init.apply(cube, [o]);
                if (!defined(o.vCol)) o.vCol = [];
                cube._maxVColumns = pick(o.table.maxVColumns, 4);
                //var off=offset(cube.container);
                //if (!defined(o.cube.width)) o.cube.width= DOC.body.clientWidth-off.left-2;
                //if (!defined(o.cube.height)) o.cube.height=DOC.body.clientHeight-off.top-2;

                //cube.container.style.width = o.cube.width + 'px';
                //cube.container.style.height = o.cube.height + 'px';       
                /* 2 header rows */
                //tblOpt.parentNode = cube.container;   
                // replace the first column text with cube.title
                //  tblOpt.header.colsText.splice(0,1,o.title.text); 
                //  if (o.title.width) tblOpt.header.colsWidth.splice(0,1,o.title.width);   
                //cube.table = new jTable(tblOpt);  

                //var td=tbl.toolbar[0].firstChild; 
                var btn = cube.setToolBar({ set: 'insert',
                    btn: [{ tag: 'INPUT', type: 'button', value: '', className: 'JTBtnDown', style: 'position:absolute;right:5px;left:auto;top:auto;bottom:4px;',
                        f: function () {
                            event.cancelBubble = true;
                            var elm = this;
                            fireEvent(cube.vCol, 'ConfigCol');
                        }
                    }]
                });


                //extend(cube.table,tblOpt);    
                //cube.table.cube = cube;
                //extend(cube,o.cube);
                //body.plotOptions = o.plotOptions;

                cube.vCol = new vCol(cube, pick(o.vColumns, o.vCol));
                if (defined(o.hCol)) {
                    cube.hCol = new hCol();
                    cube.hCol.init(cube, o.hCol);
                }
                cube._measures = [];
                if (defined(o.header.measures)) {
                    var measures = o.header.measures;
                    for (var k in measures) {
                        cube._measures.push({ name: k, showName: pick(measures[k].name, k), width: pick(measures[k].width, 80)
                        , aggregate: pick(measures[k].aggregate, function (ret, strValue) { return ret + String(strValue).toFloat(); })
                        });
                    }
                }
                var defCubeAjaxOpt = {
                    url: (cube.options.url) ? cube.options.url : cube.options.name + '.aspx',
                    crossTab: function (d) {
                    },
                    data: {},
                    success: function (d, txt, xhr) {
                        var cube = xhr.srcObject;
                        cube.resetColumn(d, xhr);
                        cube.insertData(d, xhr);
                    }, error: function (xhr, sts, txt) {
                        alert(sts);
                    }, onready: 'Load'
                };
                var defPlotOptions = { measures: { width: 70 },
                    rows: {
                        formatter: function (cube) {
                            var c, r = this, startIndex = r.data.layer;
                            if (cube.scrollX) {
                                r = cube.tBodies[0].tBody.neighbor.childNodes[r.sectionRowIndex];
                                startIndex = 0;
                            }
                            for (c = r.childNodes[r.data.layer]; c; c = c.nextSibling) c.innerText = addCommas(c.innerText, 3);
                        }
                    }
                };
                cube.options.ajaxOptions = deepExtend(defCubeAjaxOpt, cube.options.ajaxOptions);
                cube.options.plotOptions = deepExtend(defPlotOptions, cube.options.plotOptions);
                return cube;                
            },
		    resetColumn: function (data) {
		        var cube = this
				  , cw = []
				  , vCol = cube.vCol
				  , hCol = cube.hCol
				  , s
				  , jsonRet
				  , tmpLookup;
	
		        //reset values of each dimension
		        generateDimensionValues(vCol.cols, data);
		        generateDimensionValues(hCol.cols, data);
		    },
            resetPivot: function(data) {
                //while(this.colGroup.childNodes.length > 0 )
                var cube = this;
                var totalColumn = 1;
                cube.colGroup.removeAll();               
                cube.tHead.removeAll(0);
                cube.tBodies[0].removeAll(0);

                generateDimensionValues(cube.vCol.cols, data);
                generateDimensionValues(cube.hCol.cols, data);

                each(cube.hCol.cols, function(col, idx) {                    
                    if (col.width)
                        cube.colGroup.append($('<col style="width:' + col.width +'"/>'));    
                    else
                        cube.colGroup.append($('<col class="lazyCube-hCol"/>'));
                });

                var $tr, $th;
                //cube name
                $tr = $('<tr/>');
                $th;// = $('<th/>');
                
                each(cube.vCol.cols, function(col, vIdx) {
                    $th = $('<th/>');
                    if (vIdx == 0) {
                        $th.text([cube.options.header.colsText[0]]);
                        $th.attr(
                        {
                            'colSpan': cube.vCol.cols.length,
                            'rowSpan': cube.hCol.cols.length
                        });
                    }
                    else {
                        $th.css('display', 'none');
                    }
                    $th.addClass('GMCellHeader');
                    $tr.append($th);
                });

                each(cube.hCol.cols, function(col) {
                    totalColumn *= col.value.length
                });
                totalColumn *= cube._measures.length;
                for (var i = 0; i < totalColumn; i++) {
                   cube.colGroup.append($('<col class="lazyCube-vCol"/>')); 
                }

                $(cube.tHead.tBody).append($tr);

                //將hcol 逐tr長出
                each(cube.hCol.cols, function(col, hIdx) {
                    if (hIdx > 0) {
                        $tr = $('<tr/>');
                        var tmp = ''
                        ,   $tmp;

                        each(cube.vCol.cols, function() {
                            tmp += '<th/>';
                        });
                        $tmp = $(tmp);
                        $tmp.css('display', 'none');
                        $tr.append($tmp);                        
                    }

                    
                    for (var i = hIdx; i >= 0; i--) {
                        var hSpan = getColumnSpan(hIdx, cube.hCol.cols, cube._measures);                        
                        each(col.value, function(val, vIdx) {
                            for (var i = 0; i < hSpan; i++) {
                                $th = $('<th/>');
                                if ( i == 0)
                                    $th.attr('colSpan', hSpan);
                                else
                                    $th.css('display', 'none');
                                $th.text(val);
                                $th.addClass('GMCellHeader');
                                $tr.append($th);                                
                            }                            
                        });
                    }                    
                    $(cube.tHead.tBody).append($tr);
                });
                
                
                $tr = $('<tr/>').appendTo($(cube.tHead.tBody));
                each(cube.vCol.cols, function(col) {
                    $th = 
                    $('<th/>')
                        .addClass('GMCellHeader')
                        .text(col.name);
                    $tr.append($th);
                });
                //最後長出measure
                for (var i = 0; i < totalColumn; i = i + cube._measures.length) {
                    for (var j = 0; j < cube._measures.length; j++) {
                        $th = 
                        $('<th/>')
                            .addClass('GMCellHeader')
                            .text(cube._measures[j].showName)
                            .data('name', cube._measures[j].name);
                        $tr.append($th);                        
                    }
                }

                

                $('.JToolBar', cube.tblObj).attr('colspan', totalColumn + cube.vCol.cols.length).css('visibility', 'hidden');

                

                //var $thead = $('<tr><th>號馬</th><th>樣事</th></tr>');
                //$('th', $thead).addClass('GMCellHeader');

                //$(cube.tHead.tBody).append($thead);

                _private.raws = data;

                function getColumnSpan(hIdx, hCols, measures)
                {
                    var span = 1;
                    each(hCols, function(hCol, idx) {
                        if (!hCol.value.length || hCol.value.length == 0)
                            return;
                        if (idx <= hIdx)
                            return;
                        span *= hCol.value.length;

                    });

                    return span * measures.length;
                }

                function getRowSpan(hCols)
                {
                    var span = 1;
                    each(hCols, function(col, idx) {
                        span++;
                    });
                    return span;
                }
            },
		    /* 將raw data轉成layout
		     * 即根據所指定的vCol、hCol產生對應的table
		     * 
		     */
		    pivot: function(raws) {
		    	var data = [];	
		    	var tbl = this;
				var dims = {
					horizentol: [],
					vertical: []
				};
				
				//generateDimensionValues(tbl.hCol.cols, raws);
				//generateDimensionValues(tbl.vCol.cols, raws);
				recMakeDims(tbl.hCol.cols, dims.horizentol);
				recMakeDims(tbl.vCol.cols, dims.vertical);
				
				//row的header先長出來
				each(dims.vertical, function(vCol) {
					var row = $.extend([], vCol);
					each(dims.horizentol, function(hCol) {
						each(tbl._measures, function(measure, mIdx) {
							row.push(''); //塞空格先
						});					
					});				
					data.push(row);				
				});
				
				each(data, function(row) {
					//將raw data的資料pivot
					each(raws, function(raw, rIdx) {
						each(dims.horizentol, function(hCol, hIdx) {
							var rawFound = true;						
							for (var i = 0; i < hCol.length; i++) {
								if (raw[tbl.hCol.cols[i].id] !== hCol[i]) {
									rawFound = false;
								}
								if (rawFound === false)
									break;
							}
							for (var i = 0; i < tbl.vCol.cols.length; i++) {
								if (raw[tbl.vCol.cols[i].id] !== row[i]) {
									rawFound = false;
								}
								if (rawFound === false)
									break;
							}

							if (rawFound === false) {
								return;
							}
							//insert measures
							each(tbl._measures, function(measure, mIdx) {
								//前面的欄位是row header
								row[tbl.vCol.cols.length + tbl._measures.length * hIdx + mIdx] = raw[measure.name];
							});
						});//end of dim.horizental.foreach
					});//end of raw.foreach
				});//end of data.foreach				                
				return data;
		    },//end of function pivo
		    insertData: function(data, bd) {
		    	bd = bd || this.tBodies[0];
		    	var fun = []
		    	,	mc = []
		    	,	cube = this
		    	,	l = cube.vCol.cols.length;
		    	
		    	for (var i = 0; i < data.length; i++) {
                    var r = bd.insRow({ data: data[i], className: jInfo.clsName.treeRow });
                    r.childNodes[l - 1].onclick = function () {
                        var c = this; fireEvent(c.parentNode.parentNode.data.iTbody, 'TNClick');
                    }
                }
		    	
                // insert summary row	  
                for (j = 0, i = l; i < bd.rows[0].childNodes.length; i++) {
                    mc.push(i);
                    fun.push(cube._measures[j].aggregate);
                    if (++j >= cube._measures.length) j = 0;
                    //fun.push( function(r,i) {return r+String(i).toFloat();}); 
                }
		    }
		};

        //private function
        function recMakeDims(cols, plains, idx, list) {
            if (!plains || Object.prototype.toString.call(plains) !== '[object Array]') {
                throw "need to assign an array to plains.";
            }

            idx = idx || 0;
            list = list || [];      
            
            if (idx == cols.length) { //done
                var newList = [];
                plains.push(newList);
                each(list, function(v) {
                    newList.push(v);
                });
                return true;
            }       
            
            var nexti = idx + 1;
            each(cols[idx].value, function(val) {
                list[idx] = val;
                recMakeDims(cols, plains, nexti, list);
            });
        }
        function generateDimensionValues(cols, data) {
            each(cols, function (col, idx) {
                tmpLookup = {};
                col.value = [];
                each(data, function (item, j) {
                    if (!(item[col.id] in tmpLookup)) {
                        tmpLookup[item[col.id]] = 1;
                        col.value.push(item[col.id]);
                    }
                });
            });
        }  
        return ret;
    }

    function lazyCube(fnOverwritten) {
        //this.type = 'lazy-cube';	
        if (!defined(fnOverwritten) || typeof fnOverwritten != 'function') {
            return false;
        }
        var overwritten = new fnOverwritten(); // return a object        
        for (var p in overwritten) {
            this[p] = overwritten[p];
        }
    }
    lazyCube.prototype = new cubeTable();

    /* 2012/04/10 for auto complete */
    function inputBox_onchange() { this.className = jInfo.clsName.cellUpdated; }
    /*+ gFunction.inputBox_onkeydown
    	檢查是否輸入非數字，或不合宜的key 
    '0':48,96
    '-':45, 189, 109
    '9':57,105
    endParser */
    function inputBox_onkeydown() {
        var elm = this, acIdx = getData(elm, 'edFlag');
        if (event.keyCode == 9) {
            var nc = getNextCell(elm.parentNode, event.keyCode);
            if (elm.value != getData(elm, 'before')) elm.className = jInfo.clsName.cellUpdated;
            writeBack();
            fireEvent(nc, 'MouseEvents', 'click');
            return false;
        }
        else if (event.keyCode == 8) return true;
        else if (event.keyCode == 189 || event.keyCode == 109) return (acIdx == gc_edPInteger) ? false : true;
        else if (acIdx >= gc_edInteger && acIdx < gc_edInteger + 4 && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) return false;
        else return true;
    }
    /* div AutoComplete UL child Nodes _ onclick event handeler */
    function ACLI_mouseEventHandler() {
        var elm = this, isMultiLine = (elm.style.height == '38px') ? true : false;
        event.cancelBubble = true;
        switch (event.type) {
            case 'click':
                var pnt = elm.parentNode;
                var inp = pnt.previousSibling;
                if (!pnt) return;
                inp.value = (isMultiLine) ? elm.innerHTML.substr(0, elm.innerHTML.search('<')) : elm.innerHTML;

                if (pnt.parentNode.jAC) {
                    pnt.parentNode.jAC.writeBack();
                } else {

                    inp.value = (isMultiLine) ? elm.innerHTML.substr(0, elm.innerHTML.search('<')) : elm.innerHTML;
                    pnt.style.display = 'none';
                    event.cancelBubble = true;
                    if (inp.value != inp.data.before) inp.className = jInfo.clsName.cellUpdated;
                    writeBack();
                }
                break;
            case 'mouseover':
                var li = getData(elm.parentNode, 'hovered');
                if (li) li.className = li.className.replace(new RegExp(" iehover\\b"), "");
                elm.className += ' iehover';
                setData(elm.parentNode, 'hovered', elm);
                break;
            default:
                break;
        }

    }
    function inputBox_onkeyup() {
        var elm = this, acIdx = getData(elm, 'edFlag');

        if (event.keyCode == 13) { /* enter key */
            if (elm.value != getData(elm, 'before')) elm.className = jInfo.clsName.cellUpdated;
            var nc = getNextCell(elm.parentNode, event.keyCode);
            writeBack();
            fireEvent(nc, 'MouseEvents', 'click');
        }
        else if (event.keyCode == 27) { /* esc key: restore the value before editing */
            if (getData(elm, 'before') !== undefined) {
                elm.value = getData(elm, 'before'); elm.className = '';
                if (acIdx >= acIdx && acIdx < acIdx + 10 && elm.nextSibling) elm.nextSibling.style.display = 'none';
            }
        }
        /* 2012/04/10 for auto complete */
        if (elm.value.length == 0) return;
        if (acIdx >= gc_edAC && acIdx < gc_edAC + 10) {
            var sel = elm.nextSibling;
            /* 38=up, 40=down arrow,  event.keyCode==9 TABKEY */
            if ((event.keyCode == 38 || event.keyCode == 40) && sel && sel.childNodes.length > 0) {
                var li = getData(sel, 'hovered'); // current hovered child
                if (li === undefined) li = sel.firstChild;
                else {
                    li.className = li.className.replace(new RegExp(" iehover\\b"), "");
                    li = (event.keyCode == 40) ? li.nextSibling : li.previousSibling;
                    if (li === null) li = (event.keyCode == 38) ? sel.lastChild : sel.firstChild;
                }
                var j = li.innerHTML.search('<'); //<BR>
                elm.value = (j > 0) ? li.innerHTML.substr(0, j) : li.innerHTML;
                li.className += ' iehover';
                setData(sel, 'hovered', li);
                return;
            }
            var i, j, s, li, optIdx = acIdx - gc_edAC;

            while (sel.childNodes.length > 0) sel.removeChild(sel.lastChild);
            for (i = 0; i < g_options[optIdx].length; i++) {
                s = g_options[optIdx][i];
                j = s.search(elm.value);
                if (j < 0) j = s.search(elm.value.toUpperCase());
                if (j >= 0) {
                    j = g_options[optIdx][i].search('0D0A');
                    if (j > 0) {
                        li = appendChild(sel, { tag: 'LI',
                            onmouseover: ACLI_mouseEventHandler,
                            onclick: ACLI_mouseEventHandler,
                            style: 'height:38px;',
                            innerHTML: g_options[optIdx][i].replace('0D0A', '<br>')
                        }); /* option to LI */
                    }
                    else {
                        li = appendChild(sel, { tag: 'LI',
                            onmouseover: ACLI_mouseEventHandler,
                            onclick: ACLI_mouseEventHandler,
                            style: 'height:20px;',
                            innerHTML: g_options[optIdx][i]
                        }); /* option to LI */
                    }
                }
            } /* end for all g_options */
        }
    }



    function getNextCell(me, key) {
        if (me && me.parentNode && me.parentNode.tagName == 'TR') {
            var pn = me.parentNode;
            if (key == 13 && pn.nextSibling != null) { /* next row */
                var nr = pn.nextSibling;
                if (nr.childNodes.length > me.cellIndex) return nr.childNodes[me.cellIndex];
                else return null;
            }
            else if (key == 9 && me.nextSibling != null) { /* tab left cell  */
                return me.nextSibling;
            }
            else return null;
        }
        else return null;
    }
    //
    // dire: direction, 0:x, 1:vertical
    //  tPosX: target position x
    //

    var g_int = null;
    function slideBackgroundImageX(thisobj, deltaX, tPosX) {
        var cx = parseInt(thisobj.style.backgroundPositionX.replace('px', ''), 10);
        var tcx = cx + deltaX;
        thisobj.style.backgroundPositionX = tcx + "px";
        if (deltaX * (tPosX - tcx) <= 0) { window.clearInterval(g_int); g_int = null; }

    }


    function setSelectedByText(sobj, v, sFrom, sLen) {
        var opts = sobj.options;
        if (opts == null) return -1;
        for (var i = 0; i < sobj.length; i++) {
            if (sobj.options[i].text.substr(sFrom, sLen) == v) { sobj.selectedIndex = i; return i; }
        }
        return -1;
    }

    /**************************************/

    /* jInfo : 共用常數宣告, or default function(method)  宣告
    jTab.tabClass: 1.tabMain, 典型的tab , 分頁在上面
    2.carousel for iPhone,iPad 下面有圓點(水平)
    */
    jInfo.jTab = { tabClass: ['tabMain', 'tabBotton', 'carousel', 'carouselVertical'], tabItemClass: 'tabItem'
	, defaultOptions: { table: { colsWidth: [100, 100, 200, 200, 200, 100], toolbar: false, bodies: [{ id: "tbody1"}] },
	    tabItem: { type: 'classical', tabName: 'new', tabItemClass: 'tabItem'}
	}
	, itemTypes: {}
    }


    /* THE TD/TH ONCLICK EVENT FUNCTION FOR JDATEPICKER */
    function jDatePicker_onclick() {
        var d = this, dp;
        event.cancelBubble = true;

        if (d.tagName == 'TD' || d.tagName == 'TH') dp = d.parentNode.parentNode.data['jDatePicker'];
        else return false;
        if (d.className == 'lastMonth') dp.addMonth(-1);
        else if (d.className == 'nextMonth') dp.addMonth(1);
        else dp.writeBack(d, event);
        return false;
    }

    /*
    o.renderTo (man) : HTMLTableCellElement 
    o.table (optional) : jTable object jTable object , 
    scrollBody 之後必填，若沒有設定可以從o.renderTo 的parentNode.
    o.type (optional) : string 

    在new jTable時設定
    header.filter:{method:'intersaction', replaceHeader:true, 
    columns: [{cellIndex:5,type:'autoComplete' },{cellIndex:6,type:'autoComplete'} ] }
	
    */
    function jFilter(o) {
        var c, r, i, j, li, f = this, itemTag = 'OPTION';
        o = extend({ type: 'SELECT', method: 'none' }, o); /* UL(for multi-row and autoComplete) or SELECT */
        f.method = o.method;
        o.renderTo.firstChild.style.display = 'none';
        o.renderTo.style.overflow = 'hidden';
        f.renderTo = o.renderTo;


        if (o.type == 'autoComplete') {
            f.autoComplete = new jFilterAC();
            f.autoComplete.init({ elm: o.renderTo, filter: f, width: o.width, height: o.height });
            f.divAC = f.autoComplete.divAC;
            f.sel = f.divAC.lastChild;
        } else { 	  	//if (o.type == "SELECT") {
            f.divAC = appendChild(o.renderTo, { tag: 'DIV' });
            f.sel = appendChild(f.divAC, { tag: 'SELECT' });
            f.sel.onchange = function () { var sel = this; event.cancelBubble = true; fireEvent(f, 'change', { value: sel.options[sel.selectedIndex].innerText }); }
        }
        f.divAC.filter = f;
        if (o.selAll != false) f.sel.selAll = pick(o.selAll, 'ALL');
        else f.sel.selAll = false;
        if (defined(o.table)) f.table = o.table;
        else f.table = o.renderTo.parentNode.parentNode.data.iTbody.parentNode; /* bug here */
        f.cellIdx = pick(o.cellIdx, f.table.getCellIndex(o.renderTo));


        f.initOptions.apply(f, [{ data: o.data, plotOptions: o.plotOptions}]);

        return f;
    } /* end of jFilter */

    jFilter.prototype = {
        onchange: function (e) {
            var c, f = this, tb = f.table, val
			, neighbor = tb.tBodies[0].tBody.neighbor
			, r0, r, headerRow = f.renderTo.parentNode;
            if (defined(e, 'value')) val = e.value;
            else if (f.sel.tagName == 'SELECT') val = f.sel.options[f.sel.selectedIndex].innerText;
            else if (f.sel.tagName == 'INPUT') val = f.sel.value;
            else val = '';
            f.value = val;
            var headerCell = headerRow.firstChild, filters = [];
            for (; headerCell; headerCell = headerCell.nextSibling) {
                if (defined(headerCell.filter, 'value')) filters.push(headerCell.filter);
            }

            for (r = tb.tBodies[0].tBody.lastChild; r; r = r.previousSibling) {
                r.style.display = '';

                switch (f.method) {
                    case 'intersaction':  /* ∩ */
                        /* check all filter if defined */
                        for (var i = 0; i < filters.length; i++) {
                            filter = filters[i];
                            c = (tb.tBodies[0].isColSpan != true) ? r.childNodes[filter.cellIdx] : f.table.getCell(r, filter.cellIdx, 0);
                            if (filter.value != filter.sel.selAll && filter.value != c.innerText) { r.style.display = 'none'; break; }
                        }

                        break;
                    case 'union':
                        r.style.display = 'none';
                        for (var i = 0; i < filters.length; i++) {
                            filter = filters[i];
                            c = (tb.tBodies[0].isColSpan != true) ? r.childNodes[filter.cellIdx] : f.table.getCell(r, filter.cellIdx, 0);
                            if (filter.value == filter.sel.selAll || filter.value == c.innerText) { r.style.display = ''; break; }
                        }
                        break;
                    default:
                        c = (tb.tBodies[0].isColSpan != true) ? r.childNodes[f.cellIdx] : f.table.getCell(r, f.cellIdx, 0);
                        r.style.display = (val == f.sel.selAll || val == c.innerText) ? '' : 'none';
                        break;
                }
                if (neighbor && neighbor.childNodes.length > r.sectionRowIndex) neighbor.childNodes[r.sectionRowIndex].style.display = r.style.display;

            } /* rows */

            /*
            var offsetHeight=f.divAC.parentNode.offsetHeight;
            f.divAC.style.display='none';
            if (f.table.scrollY && (offsetHeight != f.divAC.parentNode.offsetHeight)  ) {
            var delta = f.divAC.parentNode.offsetHeight-offsetHeight;
            var container=f.table.tblObj.parentNode;
            container.style.top=(container.style.top.toInt()+delta)+'px';
            if (defined(container.nextSibling))
            container.nextSibling.style.top= (container.nextSibling.style.top.toInt()+delta)+'px';				
            }	*/
        }, initOptions: function (o) {
            var f = this, d = [];
            /* 如果沒有default 的options則設定 tBodies[0] 為 資料選項內容 */

            if (defined(o) && defined(o.data)) d = o.data;
            else {
                var r, i, val = -1;
                for (r = f.table.tBodies[0].tBody.firstChild; r; r = r.nextSibling) {
                    /* insertion sort */
                    if (f.table.tBodies[0].isColSpan != true) c = r.childNodes[f.cellIdx];
                    else c = f.table.getCell(r, f.cellIdx, 0);
                    for (i = 0; i < d.length; i++) {
                        val = aGb({ a: c.innerText, b: d[i], asec: true, dataType: 's' });
                        if (val == 1 || val == 0) break;
                    }
                    if (val != 0 && i == d.length) d.push(c.innerText);
                    else if (val != 0) d.splice(i, 0, c.innerText);
                }
                if (f.sel.selAll) {
                    d.splice(0, 0, f.sel.selAll);
                }
            } /* create options */
            while (f.sel.lastChild) f.sel.removeChild(f.sel.lastChild);
            var li, itemTag = (f.sel.tagName == 'SELECT') ? 'OPTION' : 'LI';
            for (i = 0; i < d.length; i++) {
                li = appendChild(f.sel, { tag: itemTag,
                    value: d[i],
                    onmouseover: ACLI_mouseEventHandler,
                    onclick: ACLI_mouseEventHandler,
                    innerHTML: d[i].replace('0D0A', '<br>')
                }); /* option to LI */
                if (o && o.plotOptions && o.plotOptions.li && o.plotOptions.li.style) extend(li.style, o.plotOptions.li.style);
            }
        } /* end of initOptions function */
	, destroy: function () {
	    var f = this, divAC = f.divAC;
	    if (defined(f.autoComplete)) f.autoComplete = f.autoComplete.destroy(); /* autoComplete */
	    else if (defined(divAC)) divAC.parentNode.removeChild(f.divAC);
	    return null;
	}, hide: function () {
	    var f = this, divAC = f.divAC;
	    divAC.style.display = 'none';
	    f.renderTo.firstChild.style.display = ''; /* column name */
	}, show: function () {
	    var f = this, divAC = f.divAC;
	    divAC.style.display = '';
	    f.renderTo.firstChild.style.display = 'none';
	    divAC.firstChild.focus();
	}
    } /* end of iFilter */

    /* auto Completer */
    var jAC = function (o) {
        var ac = this;
        if (defined(o)) ac.init(o);
    }

    jAC.prototype = {
        type: 'select'
 , init: function (o) {
     writeBack();
     var ac = this;
     var elm = o.elm; /* source element of onclick always table Cell,or input */
     var l_text;

     if (elm.tagName == 'INPUT') {
         l_text = elm.value; elm.value = '';
     } else { l_text = elm.innerText; elm.innerText = ''; };

     ac.divAC = appendChild(document.body, { tag: 'DIV', id: 'inputBox', className: 'JTACPDiv' }); /* creat div wrapper of SELECT or text input */
     var cellText = appendChild(ac.divAC, { tag: 'INPUT'
  	, onkeyup: function () { fireEvent(ac, 'Keyup'); }
  	, onblur: function () {
  	    event.cancelBubble = true;
  	    ac.writeBack.apply(ac);
  	} 
     });
     /* has been updated, then set cellUpdated class (red forecolor) */

     cellText.style.width = elm.style.width;
     if (elm.className == jInfo.clsName.cellUpdated) cellText.className = jInfo.clsName.cellUpdated;
     //
     if (l_text != null) cellText.value = l_text;
     var sel = appendChild(ac.divAC, { tag: 'UL' });
     if (!jInfo.isIE) sel.style.top = '0px';
     else sel.style.left = '-40px';
     if (elm.data) elm.data.before = l_text;
     else elm.data = { before: l_text };

     var of = offset(elm);
     ac.divAC.style.top = (of.top + 10) + 'px';
     ac.divAC.style.left = of.left + 'px';
     ac.divAC.jAC = ac;
     ac.cachedTerm = '';
     ac.elm = elm; /* the element, for writeBack */
     ac.url = pick(o.url, jInfo.url.peopleSearch);
     ac.writeBackFun = o.writeBackFun;
     ac.wlen = pick(o.wlen, 3); /*  untile more then 3 characters fire ajax request */
     ac.cols = pick(o.cols, "CNAME,AD,EMPID");

     ac.eachRow = function (d) {
         var s = '';
         for (var i = 0; i < d.length; i++) s += d[i] + '\t'; /* space '　' */
         appendChild(sel, { tag: 'LI', onmouseover: ACLI_mouseEventHandler, onclick: ACLI_mouseEventHandler,
             innerText: s
         }); /* option to LI */
     }
     cellText.focus();

     return ac;

 }
 , onKeyup: function () { /* event hander for input box keypressed */
     var ac = this, ev = event, elm = ev.srcElement;
     switch (ev.keyCode) {
         case 13:  /* enter key */
             var li = getData(ac.divAC.lastChild, 'hovered');
             if (defined(li)) fireEvent(li, 'click', ACLI_mouseEventHandler);
             break;
         case 27:  /* esc key: restore the value before editing */
             ac.divAC.firstChild.value = ac.elm.data.before; /* reset to initial */
             ac.writeBack();
             break;
         case 8:
             if (ac.cachedTerm.length == 0) return; /* backspace 第一次進來還沒有cache */
             else break;
         case 38:
         case 40:
         case 9:
             var sel = elm.nextSibling;
             if (sel && sel.childNodes.length > 0) { /*  38=up, 40=down arrow,  event.keyCode==9? TABKEY  */
                 var li;
                 if (!defined(sel.data, 'hovered')) li = sel.firstChild;
                 else {
                     li = sel.data.hovered;
                     li.className = li.className.replace(new RegExp(" iehover\\b"), "");
                     li = (ev.keyCode == 40) ? li.nextSibling : li.previousSibling;
                     if (li === null) li = (ev.keyCode == 38) ? sel.lastChild : sel.firstChild;
                 }
                 fireEvent(li, 'mouseover', null, ACLI_mouseEventHandler); /* 2013/11/27 add null */
             }
             break;
         default:
             /* 2012/04/10 for auto complete */
             if (elm.value.length < ac.wlen && (elm.value.length != (ac.wlen - 1) || elm.value.substr(0, 1) <= 'z')) return true;
             else ac.getData(elm.value);
             break;
     } /* end of switch */
     return true;
 }, getDataCached: function (term) {
     // 從上次ajax chached 的資料去作篩選 
     var ac = this, sel = ac.divAC.lastChild;
     while (sel.childNodes.length > 0) sel.removeChild(sel.lastChild);
     for (var i = 0; i < ac.cachedD.length; i++) {
         for (var j = 0; j < ac.cachedD[i].length; j++) {
             if (ac.cachedD[i][j].search(term) >= 0) { ac.eachRow(ac.cachedD[i]); break; }
         }
     }
 }, getData: function (term) {
     var ac = this, sel = ac.divAC.lastChild;
     if (ac.cachedTerm.length > 0 && term.search(ac.cachedTerm) == 0) {
         // 如果ajax 還在執行 則讓他讀完，並設定callBack ajax回來時，用更長的term去過濾他
         // 這裡不處理 term 不包含於cachedTerm，因機率很低除非真的執行很久
         if (!ac.divAC.xmlHdr) { ac.callBack = null; ac.getDataCached(term); }
         else ac.callBack = term;
         return;
     }
     else if (1 == 1) { //(ac.divAC.firvalue && ac.inp.value.length>0) { /* SQL USQL */
         ac.divAC.xmlHdr = ajax({ url: ac.url, data: { term: term, cols: ac.cols }
				, lockAjax: { elm: ac.divAC, xmlHdr: ac.divAC.xmlHdr }
				, eachRow: ac.eachRow
             /* end of eachRow */
			, init: function (xhdr) { /* clean all data before insert */

			    var sel = ac.divAC.lastChild;
			    while (sel.childNodes.length > 0) sel.removeChild(sel.lastChild);
			}, async: true
			, success: function (d, sts, hdr) {

			    ac.cachedTerm = term; /* cache data */
			    ac.cachedD = d;
			    ac.divAC.xmlHdr = null;

			    if (d.length > 0 && defined(ac.callBack) && ac.callBack !== null) ac.getDataCached(ac.callBack);

			}, error: function (hdr, a, b) {
			    ac.divAC.xmlHdr = null;

			}
         });
     } else { /* call Web Service */
     }
 }, writeBack: function () {
     var ac = this, s;
     if (ac.divAC.firstChild.value != ac.elm.data.before) {
         ac.elm.className = jInfo.clsName.cellUpdated; //ac.divAC.firstChild.className;	
         s = ac.divAC.firstChild.value;
     } else s = ac.elm.data.before;

     if (defined(ac.writeBackFun)) ac.writeBackFun(s);
     else if (ac.elm.tagName == 'INPUT') ac.elm.value = s;
     else ac.elm.innerHTML = s;
     ac.destroy();
 }, destroy: function () {
     var ac = this;
     if (defined(ac.divAC)) ac.divAC.parentNode.removeChild(ac.divAC);
     ac.divAC = null;
     return null;
 }

    } /* end of jAC prototype */

    /* single-option filter */
    var jFilterAC = extendClass(jAC, {
        type: 'single'
	, init: function (o) {
	    writeBack();
	    var ac = this, elm = o.elm;
	    /* 
	    IE8 在sel onscroll  時會搶走inp focus
	    */


	    var funFocus = function () {
	        var div = this.parentNode;
	        if (defined(div, 'timeoutVariable')) { clearTimeout(div.timeoutVariable); div.timoutVariable = null; }
	    }, funBlur = function () {
	        var div = this.parentNode;
	        /* maybe the list object which in the divAC get focus, if call writeback immediately hte list will hided and click event been canceled */
	        div.timeoutVariable = setTimeout(function () { div.jAC.elm.filter.hide(); /* ac.writeBack.apply(ac); */ }, 200);
	    };


	    ac.divAC = appendChild(document.body, { tag: 'DIV', className: 'JTACPDiv' }); /* creat 一個 div 來包住 SELECT, 以及 text input */
	    var cellText = appendChild(ac.divAC, { tag: 'INPUT', onblur: funBlur, onfocus: funFocus });
	    cellText.style.width = elm.offsetWidth + 'px'; //IE8 has no default width value


	    //if (elm.className=='cellUpdated') cellText.className='cellUpdated';
	    /* 這裡要改成 上一次選的 filter.value */
	    if (defined(o.filter.value)) cellText.value = o.filter.value;
	    // if (l_text != null) cellText.value = l_text; 
	    var sel = appendChild(ac.divAC, { tag: 'UL',
	        onfocus: funFocus, onscroll: funFocus
  	, onblur: funBlur
	    });

	    //1. 設定 right 無效，因為class理有設定left
	    //2. 可能跟body 的 margin有關, IE 跟Safari 不同
	    if (o.width) sel.style.width = o.width + 'px';
	    else sel.style.width = (cellText.offsetWidth + 40) + 'px';
	    cellText.style.left = (ac.divAC.offsetWidth - cellText.offsetWidth) + 'px';
	    sel.style.left = (ac.divAC.offsetWidth - sel.offsetWidth) + 'px';
	    cellText.style.top = '0px';
	    sel.style.top = (cellText.offsetHeight) + 'px';
	    sel.style.margin = '0px';
	    var of = offset(elm); // of.left, of.top); //IE8 left=451, top=40, Safari 459, 47
	    ac.divAC.style.top = (of.top + 3) + 'px'; // (jInfo.isIE)? (of.top+3)+ 'px':of.top+'px' ;
	    ac.divAC.style.left = ((of.left + elm.offsetWidth) - ac.divAC.offsetWidth + 3) + 'px'; /* 右邊靠齊*/
	    ac.divAC.jAC = ac;
	    //ac.cachedTerm='';
	    ac.elm = elm; /* 要寫回去的 element, for writeBack */

	    cellText.focus();
	    //sel.focus();
	    return ac;

	}, writeBack: function () {
	    var ac = this, s = ac.divAC.firstChild.value;
	    fireEvent(ac.elm.filter, 'change', { value: s });
	    ac.elm.filter.hide();
	    //if (defined(ac.divAC)) ac.divAC.style.display='none';
	}

    });

    var jMutipleSelect = extendClass(jFilterAC, {
        type: 'multiple',
        init: function (o) {

        }
    });
    function jDatePicker(o) {
        var dp = this, val = '', i, j, t = extend({ parentNode: document.body, width: 300, height: 200, d: new Date }, o);
        try {//xiaodong01.wang--20121016
            if (t.parentNode.lastChild.className == 'JTACPDiv' || t.parentNode.lastChild.className == null) { // prevent event bubbling, check if div exist
                t.parentNode.lastChild.style.display = '';
                t.parentNode.lastChild.lastChild.style.display = ''; //table object      
                return t.parentNode.lastChild.data.jDatePicker;
            }
            else {
                dp.d = t.d;
                val = t.parentNode.innerText;
                t.parentNode.innerText = '';
                dp.divObj = appendChild(t.parentNode, { tag: 'DIV', className: 'JTACPDiv' });
                dp.divObj.data = { 'jDatePicker': dp };
            }
        }
        catch (e) {
            dp.d = t.d;
            val = t.parentNode.innerText;
            t.parentNode.innerText = '';
            dp.divObj = appendChild(t.parentNode, { tag: 'DIV', className: 'JTACPDiv' });
            dp.divObj.data = { 'jDatePicker': dp };
        } //xiaodong01.wang--20121016
        dp.weekNo = o.weekNo;
        dp.format = o.format;
        if (o.parentNode.innerText != '' && dp.format) dp.d.format(val, dp.format);
        var inp = appendChild(dp.divObj, { tag: 'INPUT', type: 'text', value: dp.d.toString(dp.format),
            onclick: function () { this.nextSibling.style.display = ''; event.cancelBubble = true; } 
        });
        inp.style.width = (t.parentNode.offsetWidth == '') ? '60px' : t.parentNode.offsetWidth;
        //var colsNo = (this.weekNo)? 8:7;

        var wName = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
        if (dp.weekNo !== undefined) wName.splice(0, 0, dp.weekNo);

        var tbl = appendChild(dp.divObj, { tag: 'TABLE', style: 'width:' + (wName.length * 30) + 'px;' });

        var r = appendChild(appendChild(tbl, { tag: 'THEAD' }), { tag: 'TR', className: 'headline' });
        r.parentNode.data = { 'jDatePicker': dp }; // table.thead
        appendChild(r, { tag: 'TH', innerHTML: '<img src="' + g_URL + '/Styles/jTable/elegant/previous.png" >', className: 'lastMonth', onclick: jDatePicker_onclick });
        appendChild(r, { tag: 'TH', colSpan: wName.length - 2, style: 'vertical-align:top;color:#663300' }); // title (yyyy/mm)
        appendChild(r, { tag: 'TH', innerHTML: '<img src="' + g_URL + '/Styles/jTable/elegant/next.png" >', className: 'nextMonth', onclick: jDatePicker_onclick });
        r = appendChild(tbl.tHead, { tag: 'TR' });
        for (i = 0; i < wName.length; i++) appendChild(r, { tag: 'TD', innerText: wName[i], style: 'color:' + ((wName[i].substr(0, 1) == 'S') ? 'red' : 'blue') + ';width:30px;' });
        dp.addMonth(0);
        return dp;
    }

    jDatePicker.prototype = {
        addMonth: function (delta) {
            var dp = this;
            dp.d.addMonth(delta);
            var i, j, d = new Date(dp.d.getTime()); // d=this.d (pointer), 

            var sYYYYMM = dp.d.getFullYear() + "/" + (dp.d.getMonth() + 1);
            d.setDate(0); // the end date of last month
            var wno = 1; w = d.getDay(); //0=Sun,Mon=1,Tue=2...
            var r, tbl = dp.divObj.lastChild;
            while (tbl.tHead.rows.length > 2) tbl.tHead.removeChild(tbl.tHead.lastChild);
            tbl.tHead.firstChild.childNodes[1].innerText = dp.d.getFullYear() + "/" + (dp.d.getMonth() + 1);
            r = appendChild(tbl.tHead, { tag: 'TR' });

            if (dp.weekNo !== undefined) appendChild(r, { tag: 'TD', innerText: wno });
            // last Month
            for (i = 0; i <= w; i++) appendChild(r, { tag: 'TD', innerText: (d.getDate() - w) + i, className: 'lastMonth', onclick: jDatePicker_onclick });
            // this month
            d = (dp.d.getMonth() == 11) ? new Date(dp.d.getFullYear() + 1, 0, 1, 0, 0, 0, 0) : new Date(dp.d.getFullYear(), dp.d.getMonth() + 1, 1, 0, 0, 0, 0);
            d.setDate(0); // this last date of this month
            var dlast = d.getDate();
            for (j = 1, w = w + 1; j <= dlast; j++, w++) {
                if (w == 7) {
                    r = appendChild(tbl.firstChild, { tag: 'TR' });
                    w = 0;
                    if (dp.weekNo !== undefined) appendChild(r, { tag: 'TD', innerText: ++wno });
                }
                appendChild(r, { tag: 'TD', innerText: j,
                    onmouseover: function () { this.className += ' iehover'; },
                    onmouseout: function () { this.className = this.className.replace(new RegExp(" iehover\\b"), ""); },
                    onclick: jDatePicker_onclick
                });
            }
            // next month
            for (i = 1, j = w; j < 7; j++) appendChild(r, { tag: 'TD', innerText: i++, className: 'nextMonth', onclick: jDatePicker_onclick });

        }
        /*+ parseInt jDatePicker.prototype.writeBack
        write the datetime string back to cell element, and set the cellText
        c: the cell been clicked
        e: event object (mouse event) 
        */
, writeBack: function (c, e) {
    var dp = this
				, p = dp.divObj.parentNode;
    dp.d.setDate(parseInt(c.innerText, 10));
    e.cancelBubble = true;
    var inp = dp.divObj.firstChild, nd = dp.d.toString(dp.format);
    if (inp && defined(inp.data) && inp.data.before != nd) {
        inp.value = nd;
        inp.className = jInfo.clsName.cellUpdated;
    }
    writeBack();
}


    }

    /* 
    2014/01 : print dom element 
    */
    function jPrinter(o) {
        var jp = this;
        var t = extend({ orientation: 'landscape', autoColse: true, pageTitle: 'printPage', height: 500, width: 1000 }, o);
        jp.orientation = t.orientation;
        jp.options = t;
        jp.init();
    }
    jPrinter.emptyObject = function () {
        var emp = document.createElement('div');
        emp.style.pageBreakAfter = 'always';
        return emp;
    };

    jPrinter.prototype = {
        init: function () {
            var jp = this, o = jp.options;
            jp.printPage = window.open('', '_blank', "height=" + o.height + ",width=" + o.width);
            /* jp.printPage.document.open();	
            var fileref=jp.printPage.document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", "http://tnvcmipad.cminl.oa/infoMon/Styles/jTable/Elegant/J10-1.1.css");
            */
            var css = '', str = "<!DOCTYPE HTML 4.1><HTML><head><OBJECT classid='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'?height=0 id=WebBrowser name=wc width=0></OBJECT>";
            str += ' <meta http-equiv="content-type" content="text/html;charset=UTF-8" />';
            str += '<meta http-equiv="X-UA-Compatible" content="IE=8" />';
            str += '<link rel="stylesheet" type="text/css" href="http://tnvcmipad.cminl.oa/infoMon/Styles/jTable/Elegant/J10-1.1.css">';
            str += "<title>" + o.pageTitle + "</title>";
            str += '<style type="text/css" media="print"> '; /* @media print{@page {size: landscape}} </style>; */
            str += '.landscape {-webkit-transform: rotate(-90deg);-moz-transform: rotate(-90deg); transform: rotate(90deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}';
            str += ' @page {  size:' + o.orientation + '; } ';
            str += ' </style>';
            if (o.css) each(o.css, function (v) { str += '<link rel="stylesheet" type="text/css" href="' + v + '">'; });

            str += "</head>";

            jp.pageHeader = str;
            jp.pageBody = "<body class='" + jp.orientation + "' style='overflow:visible;margin:0px;' >";
        },
        putElement: function () {
            var jp = this;
            each(arguments, function (elm, idx) {
                if (typeof elm === 'string') elm = document.getElementById(elm);
                if (elm) {
                    jp.pageBody += "<" + elm.tagName + " class='" + elm.className + "'  style='" + elm.style.cssText + "'>";
                    jp.pageBody += elm.innerHTML + "</" + elm.tagName + ">";
                }
            });

        },
        breakPage: function () {
            var jp = this;
            var emp = jPrinter.emptyObject();
            jp.putElement(emp);
        },
        printElement: function () {
            var jp = this;
            each(arguments, function (elm) { jp.putElement(elm); });
            jp.print();
        }, print: function () {
            var jp = this;
            if (jp.printPage) {
                jp.printPage.document.write(jp.pageHeader + jp.pageBody + "</body></html>");
                if (jInfo.isIE) jp.printPage.document.all.WebBrowser.ExecWB(7, 1); /* preView */
                else jp.printPage.print();
                jp.destroy(); /* close the print preview window */
            }
            jp.destroy();
        }, destroy: function () {
            var pt = this;
            //	pt.printPage.close();
            pt.printPage = null;
            return null;
        }
        //document.body.insertBefore(elm
    }
    /*+p 
    jTab 
    @param(object) : 
    tabClass(string):  set tab class, default 'tabMain'  ,reference jInfo.jTab.tabClass 
    tabItemClass(string):  tab Item class, default 'tabItem'
    tabs(string or array of string) : call newTabs create tabItem with tabName=tabs[i]
    top(string) : assign tab top position, defaut top='150px'
 		
    tabItems[] : tabItem array, call newTab to create a new tabItem. ex. [{tabName:'name1', withTable:true }, ...]
    default tabItem is a DIV, which include a span to show  tabName, and a 'x' in the front  as a botton for deleting tabItem , depend on tabItem class
 			
    tabItemHeight (integer): default 10 (px),set the tabItem height
    style : you also can style the  jTab, ex ： {top: 10px, ...} 
    return or attribute created:
    jTab.me : HTMLDIV object 
    jTab.tabAdd (HTMLDIV): add new tabItem
    jTab.tabAdd.data.jTab :  jTab object pointer
    */

    function jTab(o) {
        var tab = this;
        tab.count = 0;
        tab.tabItems = [];
        var t = extend({ tabClass: jInfo.jTab.tabClass[0], tabItemClass: jInfo.jTab.tabItemClass, jTableOptions: jInfo.jTab.jTableOptions }, o);
        tab.options = t; // store the options object
        tab.tabItemHeight = pick(o.tabItemHeight, 10); // tab name or icon height, not include tabPanel
        tab.init();
        tab.newTab(pick(o.tabItems, o.tabName));
        if (tab.tabItems.length > 0) tab.showTabItem(tab.tabItems[0]);
    }

    jTab.prototype = {
        init: function () {
            var tab = this;
            tab.y = 300; //y: height of the tab div 在設定panel高度，及tabItem位置時，會用到this.y ，所以this.y 一定要設定

            o = tab.options;
            if (o.renderTo) {
                tab.me = (typeof (o.renderTo) == 'string') ? document.getElementById(o.renderTo) : o.renderTo;
                tab.me.className = o.tabClass;
            }
            else tab.me = appendChild((o.parentNode) ? o.parentNode : document.body, { tag: 'DIV', className: o.tabClass });

            /* create one new tabItem (+) for adding new tabItem  */
            if (o.withAddTab != false) {
                tab.newTab([{
                    tabName: '+'
			, type: o.defaultItemType || 'classical'
			, withPanel: false
			, click: function () {
			    var ti = getData(this.parentNode, 'jTab').newTab([{ tabName: 'new'}]);
			    ti.tab.showTabItem(ti);
			}
                }]);
                tab.tabAdd = tab.me.firstChild;
                tab.tabAdd.style.width = '30px';
                tab.tabAdd.firstChild.className = 'addItem';
            }

            tab.me.data = { jTab: tab };
            tab.me.tab = tab;
            if (o.style) {
                extend(tab.me.style, o.style);
                tab.y = parseInt(pick(o.style.height, '300'), 10); // this.y 
            }

        }
	, initItem: function (options) {
	    var tab = this,
	    //optionsItem = tab.options.chart,
			type = options.type || jInfo.jTab.defaultOptions.tabItem.type,
			item = new jInfo.jTab.itemTypes[type]();
	    item.init(tab, options);
	    return item;
	}
	, getjTable: function () { var tab = this; if (tab.currentTab.data) return tab.currentTab.data.jTable; else return undefined; }
	, getLastTabDiv: function () {
	    var tab = this;
	    if (tab.tabAdd) return tab.tabAdd;
	    else {
	        if (tab.tabItems.length > 0) {
	            return tab.tabItems[tab.tabItems.length - 1].me.nextSibling;
	        }
	        else return null;
	    }
	}
	, newTab: function (tabs) {
	    /* 新產生的 tabItem class 是不是要跟前面的一樣, 還是每個tabIem各自設定？*/
	    var o = extend({}, jInfo.jTab.defaultOptions.tabItem);
	    var tab = this, tabItem;
	    if (typeof (tabs) == 'string') {
	        o.tabName = tabs;
	        tabItem = tab.initItem(o);
	    } else { /* array */
	        for (var i = 0; i < tabs.length; i++) {
	            var o = extend({}, jInfo.jTab.defaultOptions.tabItem);
	            o = extend(o, tabs[i]);
	            //if (this.option && defined(this.option.defaultItemType)
	            tabItem = tab.initItem(o);
	            if (tab.tabAdd) tab.tabItems.splice(tab.tabItems.length - 1, 0, tabItem);
	            else tab.tabItems.push(tabItem);
	        }
	    }
	    return tabItem;
	}
	, removeTab: function (divItem) {
	    var tab = this, tabItem = divItem.tabItem;
	    if (tab.count == 1) return false;
	    else tab.count = tab.count - 1;
	    for (var i = 0; i < tab.tabItems.length; i++) {
	        if (tab.tabItems[i] == tabItem) { tab.tabItems.splice(i, 1); break; }
	    }
	    tab.me.removeChild(getData(divItem, 'divTabPanel'));
	    tab.me.removeChild(divItem);
	    if (tab.currentTab == divItem && tab.tabItems.length > 0) fireEvent(tab.tabItems[0].me, 'click'); /* if tabcount==0? */
	}
	, setAttr: function (options) {
	    var tab = this;
	    if (!defined(tab.me)) return;
	    if (options.x) { tab.x = options.x; tab.me.style.width = options.x + 'px'; }
	    if (options.y) { tab.y = options.y; tab.me.style.height = options.y + 'px'; }
	    //var o= extend({},options);
	    //if (o.y -= this.tabItemHeight;
	    each(tab.tabItems, function (tabItem) { tabItem.setAttr(options); });

	}
        /* show Tab 
        param@divTabItem 可以為DIV (HTMLDivElement) 或tabItem object
        如果找到 return tabItem 找不到 return null
        */
	, showTabItem: function (divTabItem) {
	    var ret = false,
		tab = this,
		tabItem = pick(divTabItem.tabItem
		, divTabItem), c;

	    //w=pick(webResolution,{x:320,y:480});
	    for (i = 0; i < tab.tabItems.length; i++) {
	        c = tab.tabItems[i];
	        if ((typeof (divTabItem) == 'string' && c.tabName == divTabItem) || c == tabItem) { /* show the item */
	            c.me.style.backgroundColor = pick(c.selectedColor, 'darkblue'); //pick(this.options.plotOptions.tabItem.backgroundColor,'darkblue');				
	            c.me.lastChild.style.color = pick(c.selectedFontColor, 'black');
	            if (typeof (tabItem) == 'string') tabItem = c;
	            if (defined(c.tabPanel)) c.tabPanel.style.display = '';
	            ret = true;
	        }
	        else {/* hide the item */
	            c.me.lastChild.style.color = 'gray';
	            c.me.style.backgroundColor = '#D3D3D3'; //IE6  has no lightgray color 
	            if (defined(c.tabPanel)) c.tabPanel.style.display = 'none';
	        }
	    }
	    if (ret) {
	        this.currentTab = tabItem.me;
	        return tabItem;
	    }
	    else return null;
	}
	, updateTab: function (o) {
	    var c;
	    for (c = this.me.firstChild; c && c.className == this.tabItemClass && c.childNodes.length >= 2; c = c.nextSibling) {
	        if (o.tabName == c.childNodes[1].innerText || c.childNodes[1].innerText == 'new') {
	            this.currentTab = c;
	            c.childNodes[1].innerText = o.tabName;
	            fireEvent(c, 'click');
	            return c;
	        } 
	    }
	    /* not found then create new */
	    this.currentTab = this.newTab([o]).me;
	    return this.currentTab;
	} // jTab.updateTab
    } // end of iTab.prototype
    /*
    TabItem
    TabItem.tabPanel
    */
    var TabItem = function () { return this; };
    TabItem.prototype = {
        type: 'tabItem',
        setAttr: function (options) {
            var div = this.me;
            div.style.top = options.top + 'px';
            div.style.left = options.left + 'px';
            //options=delAttribute(options,['top','left']);

            if (defined(options.tabName)) {
                this.tabName = options.tabName;
                this.spanName.innerText = options.tabName;
            }
        },
        /*init0: for all Item type before init (common)
        this.me : HTMLDIVElement
        this.me.tabItem = this (TabItem)
        this.tabName : string 
        this.tab : jTab Object
        this.tabPanel : HTMLDIVElement
        */
        init0: function (tab, options) {
            var ti = this
		, btn
		, divTabItem
		, tabName = options.tabName
		, type = options.type
		, defOpt = { label: { y: 5 }, showText: true }
		, tabOpt = (tab.options.plotOptions) ? extend(defOpt, tab.options.plotOptions.tabItem) : defOpt
		, fnclick = options.click ? options.click : function () {
		    getData(this, 'jTab').showTabItem(this);
		    event.cancelBubble = true;
		    fireEvent(this.tabItem, 'click');
		};

            ti.tabName = tabName;
            divTabItem = appendChild(tab.me, { tag: 'DIV', insBefore: tab.getLastTabDiv(), className: options.tabItemClass, onclick: fnclick });
            if (options.style) extend(divTabItem.style, options.style);
            for (etype in options.events) addEvent(ti, etype, options.events[etype]);
            if (tabName.length > 18) divTabItem.style.width = '220px'; //(parseInt(divTabItem.style.width,10)+60)+'px';
            btn = appendChild(divTabItem, { tag: 'SPAN', innerText: tabName, align: 'center' });
            /* tabItem name, */
            if (tabOpt.showText == false) btn.style.display = 'none';
            else {
                if (tabOpt.label.y) btn.style.top = tabOpt.label.y + 'px';
                if (tabOpt.label.x) btn.style.left = tabOpt.label.x + 'px';
                btn.style.position = 'relative';
                if (tabOpt.label.style) extend(btn.style, tabOpt.label.style);
                btn.style.height = '22px';
            }
            if (tab.count == 0) btn.className = 'first';
            ti.spanName = btn;
            divTabItem.data = { jTab: tab };
            ti.me = divTabItem;
            ti.me.tabItem = ti;
            ti.tab = tab;

            if (options.withPanel !== false) {
                // create tabPanel(div) and jTable object

                var tbl, tabPanel = appendChild(tab.me, extend({ tag: 'div', className: 'tabPanel' }, options.tabPanel));
                ti.tabPanel = tabPanel;
                tabPanel.tabItem = ti; //HTMLDiv（panel) 物件指回tabItem object
                var tpOptions = pick(options.tabPanel, { withTable: true });
                if (tpOptions.withTable) {
                    var o = extend({ parentNode: tabPanel, id: 'tb' + tab.me.childNodes.length }, jInfo.jTab.defaultOptions.table);
                    tbl = new jTable(o);
                }

                extend(divTabItem.data, { divTabPanel: tabPanel, jTable: tbl });
                tab.currentTab = btn; // jiantian something wrong tab.currentTab=this? 
                tab.count++;
            }

            return divTabItem;
        },
        init: function (tab, options) {
            var ti = this;
            var tabName = options.tabName,
		type = options.type;
            var divTabItem = ti.init0(tab, options);
            if (options.withPanel !== false) {
                //產生一個div 可以刪除 此tabItem的按鈕
                var btn = divTabItem.firstChild;
                appendChild(divTabItem, { insBefore: btn, tag: 'input', type: 'text', value: 'x', className: 'JTBRemove',
                    onmouseover: function () { this.style.visibility = 'visible'; this.style.backgroundColor = 'dimgray'; }
				, onmouseout: function () { this.style.backgroundColor = 'darkgray'; },
                    onclick: function () {
                        event.cancelBubble = true;
                        getData(this.parentNode, 'jTab').removeTab(this.parentNode);
                    }
                });

                btn.onmouseover = function () {
                    this.style.borderTop = '0px none'; //solid black';
                    this.previousSibling.style.visibility = 'visible'; // disply='none' will disable onmouseouver event of the btn
                    event.cancelBubble = true;
                };
                btn.onmouseout = function () { this.previousSibling.style.visibility = 'hidden'; event.cancelBubble = true; }

            }

            return divTabItem;
        },
        /*新增一個page 於panel 下方劃半透明"。", 手指按住左右滑動翻頁
        */
        addPage: function (pageName) {
            var ti = this, tabPanel = ti.tabPanel;
            var zIdx = tabPanel.style.zIndex;
            if (!defined(ti.pageNum)) {
                ti.pageNum = 2;
                //tabPanel.style.width=(parseInt(tabPanel.style.width,10)*2)+'px';
                ti.divPage = appendChild(tabPanel, { tag: 'div', style: 'fontSize:20px;position:absolute;', align: 'center', innerText: '。。' });
                ti.divPage.style.top = (tabPanel.style.height.toInt() - 20) + 'px';
                ti.divPage.style.left = Math.round(tabPanel.style.width.toInt() / 2) + 'px';
            }
            else {
                ti.divPage.innerText += '。';
                ti.pageNum += 1;

            }
        },
        /* split tabPanel */
        splitPanel: function (divs) {
            var ti = this, tabPanel = ti.tabPanel
			, div;
            for (var i = 0; i < divs.length; i++) {
                div = appendChild(tabPanel, { tag: 'div', id: divs[i].id, style: 'position:absolute;left:0px;top:0px;' });
                extend(div.style, divs[i].style);
            }
        }
    }; // end of TabItem

    var ClassicalItem = extendClass(TabItem);
    jInfo.jTab.itemTypes.classical = ClassicalItem;

    /* the carousel tabItem class */
    var CarouselItem = {
        type: 'carousel',
        setAttr: function (w) {
            var ti = this;
            if (defined(w.tabName)) {
                ti.tabName = w.tabName;
                ti.spanName.innerText = w.tabName;
                return; /* ONLY ? */
            }
            var div = ti.me, /*div object （包含name , x span 刪除 或 icon）*/
			tab = ti.tab,
			pHeight = pick(w.y, tab.y) - tab.tabItemHeight
			, defOpt = { valign: 'bottom' }
			, tabOpt = (tab.options.plotOptions) ? extend(defOpt, tab.options.plotOptions.tabItem) : defOpt
            width = pick(tabOpt.width, (tabOpt.showText) ? 40 : 20),
			height = pick(tabOpt.height, tab.tabItemHeight),
			chart = ti.chart;
            // tabItem 設定tabItem 的 按鈕box(div object) 以及文字(div.firstChild, span)
            div.style.width = width + 'px';
            div.style.height = height + 'px';
            //if (tabOpt.backgroundColor) 
            div.style.backgroundColor = pick(tabOpt.backgroundColor, 'darkblue');
            div.style.color = pick(tabOpt.color, 'white');
            ti.selectedColor = div.style.backgroundColor;
            ti.selectedFontColor = div.style.color;

            /* 放在tab 的中間 IE 找不到時會有問題 Safari return -1 
            index of array 計算 style.left 
            */
            var layout = pick(tabOpt.layout, 'horizontal'), idx;
            try { idx = tab.tabItems.indexOf(ti); }
            catch (e) { idx = -1; }
            if (idx == -1) idx = tab.tabItems.length;

            if (layout == 'horizontal') {
                dh = div.style.height.toInt();
                dw = 0;
                if (tabOpt.valign == 'top') {
                    div.style.top = '0px';
                    if (ti.tabPanel) ti.tabPanel.style.top = div.style.height;
                }
                else div.style.top = pick(tabOpt.top, pHeight) + 'px'; //under panel, 放在tab 的底部
                /* 靠左邊 */
                if (tabOpt.align == 'left') {
                    if (idx == 0) div.style.left = '0px';
                    else if (tab.tabItems[idx - 1].me == tab.tabAdd) {
                        div.style.left = tab.tabAdd.style.left;
                        tab.tabAdd.style.left = (div.style.left.toInt() + div.style.width.toInt()) + 'px';
                    } else {
                        div.style.left = (J10Adapter.offset(tab.tabItems[idx - 1].me).left + tab.tabItems[idx - 1].me.offsetWidth) + 'px'; /* 緊鄰左邊*/

                    }
                }
                else if (tabOpt.align == 'right')
                    div.style.left = (w.x - (tab.options.tabItems.length - idx) * width) + 'px';
                else /* 置中 */
                    div.style.left = (Math.round(w.x / 2) + (idx - Math.round(tab.options.tabItems.length / 2)) * width) + 'px';
                if (this.tabPanel) {
                    this.tabPanel.style.height = (w.y - height) + 'px';
                    this.tabPanel.style.width = w.x + 'px';
                    if (chart) chart.setSize(w.x, w.y - height, false); // reflow (resize event will do animation)
                }

            } else { /* vertical 要旋轉 */
                //var tmp =width; 
                //width = height;
                //height = tmp;
                div.style.width = height + 'px';
                div.style.height = width + 'px';
                var isWebKit = /AppleWebKit/.test(navigator.userAgent); // )? -25:0;
                //div.style.left = (w.x-div.style.width.toInt()) + 'px';			
                if (tabOpt.align == 'right') {
                    if (isWebKit) {
                        div.style["-webkit-transform"] = "rotate(90deg)";
                        div.style["-moz-transform"] = "rotate(-90deg)";
                        div.style.left = (w.x - width + pick(tabOpt.x, 0) - 25) + 'px';
                    } else { /* IE */
                        div.style["filter"] = "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)"; //3 -90degree
                        div.style.left = (w.x - width + pick(tabOpt.x, 0)) + 'px';
                    }
                }
                else {
                    div.style.left = '0px'; /*  left */
                    if (isWebKit) {
                        div.style["-webkit-transform"] = "rotate(90deg)";
                    } else { /* IE */
                        div.style["filter"] = "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"; //3 -90degree
                        div.style.left = (w.x - width + pick(tabOpt.x, 0)) + 'px';
                    }

                    if (ti.tabPanel) ti.tabPanel.style.left = div.style.width;
                }
                if (isWebKit)
                    div.style.top = (pick(tabOpt.y, 0) + height * idx + 25) + 'px';
                else
                    div.style.top = (pick(tabOpt.y, 0) + height * idx) + 'px';

                if (ti.tabPanel) {
                    ti.tabPanel.style.width = (w.x - width) + 'px';
                    ti.tabPanel.style.height = w.y + 'px';
                    if (chart) chart.setSize(w.x - width, w.y, false); // reflow (resize event will do animation)
                }
                //  -moz-transform: rotate(-90deg);        
            }

            /* set the attribute of tabPanel which contained chart or table */
        },
        init: function (tab, options) {
            var ti = this, tabName = options.tabName,
			type = options.type,
		divTabItem = ti.init0(tab, options);
            divTabItem.style.height = tab.tabItemHeight + 'px';

            divTabItem.firstChild.style.width = '100%';
            divTabItem.firstChild.style.height = '100%';
            divTabItem.firstChild.style.verticalAlign = 'bottom';
            var div = pick(divTabItem.offsetParent, divTabItem.parentNode);
            var opt = { x: div.offsetWidth, y: div.offsetHeight };
            if (opt.x == 0 && opt.y == 0) { /* 2012/12 bug div 裡面沒有物件時，offsetWidth=0 改設為 style.width */
                opt.x = div.style.width.toInt();
                opt.y = div.style.height.toInt();
            }
            ti.setAttr(opt);
            return divTabItem;
        } // CarouselItem.init
    };
    CarouselItem = extendClass(TabItem, CarouselItem);
    jInfo.jTab.itemTypes.carousel = CarouselItem;

    WIN.TabItem = TabItem;
    WIN.jAC = jAC; /* autoComplete */
    WIN.jDatePicker = jDatePicker;
    WIN.jFilter = jFilter;
    WIN.jPrinter = jPrinter;
    WIN.jTab = jTab;

    WIN.jTable = jTable;
    WIN.jTbody = jTbody;
    WIN.jInfo = jInfo;
    WIN.lockAjax = lockAjax;
    WIN.addCommas = addCommas; /* 因為很多地方都用到，把他放在win.底下 */
    WIN.ajax = ajax;
    WIN.appendChild = appendChild;
    WIN.g_isIE = g_isIE;
    WIN.each = each;
    WIN.defined = defined;
    WIN.showLoading = showLoading;
    WIN.extend = extend;
    extend(J10Adapter, {
        addEvent: addEvent
	  , addMonth: addMonth
	  , ajax: ajax
   , animate: animate
  	, appendChild: appendChild
  	, deepExtend: deepExtend
  	, defined: defined
  	, each: each
  	, extend: extend
  	, extendClass: extendClass
  	, fireEvent: fireEvent
  	, getCookie: getCookie
  	, isArray: isArray
  	, isNumber: isNumber
  	, isObject: isObject
  	, isString: isString
  	, lockAjax: lockAjax
  	, merge: merge
  	, offset: offset
  	, pick: pick
  	, setCookie: setCookie
  	, td_onclick: td_onclick
  	, removeEvent: removeEvent
  	, resizeCell: resizeCell
    });
} ());