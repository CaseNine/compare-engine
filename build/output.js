function arrayInsertInto(e,t,n){e.splice(t,0,n)}define("mout/lang/toString",[],function(){function e(e){return e==null?"":e.toString()}return e}),define("mout/string/startsWith",["../lang/toString"],function(e){function t(t,n){return t=e(t),n=e(n),t.indexOf(n)===0}return t}),define("mout/string/endsWith",["../lang/toString"],function(e){function t(t,n){return t=e(t),n=e(n),t.indexOf(n,t.length-n.length)!==-1}return t}),define("mout/array/forEach",[],function(){function e(e,t,n){if(e==null)return;var r=-1,i=e.length;while(++r<i)if(t.call(n,e[r],r,e)===!1)break}return e}),define("mout/function/prop",[],function(){function e(e){return function(t){return t[e]}}return e}),define("mout/object/hasOwn",[],function(){function e(e,t){return Object.prototype.hasOwnProperty.call(e,t)}return e}),define("mout/object/forIn",[],function(){function n(){t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],e=!0;for(var n in{toString:null})e=!1}function r(r,s,o){var u,a=0;e==null&&n();for(u in r)if(i(s,r,u,o)===!1)break;if(e)while(u=t[a++])if(r[u]!==Object.prototype[u]&&i(s,r,u,o)===!1)break}function i(e,t,n,r){return e.call(r,t[n],n,t)}var e,t;return r}),define("mout/object/forOwn",["./hasOwn","./forIn"],function(e,t){function n(n,r,i){t(n,function(t,s){if(e(n,s))return r.call(i,n[s],s,n)})}return n}),define("mout/object/matches",["./forOwn"],function(e){function t(t,n){var r=!0;return e(n,function(e,n){if(t[n]!==e)return r=!1}),r}return t}),define("mout/function/makeIterator_",["./prop","../object/matches"],function(e,t){function n(n){switch(typeof n){case"object":return n!=null?function(e,r,i){return t(e,n)}:n;case"string":case"number":return e(n);default:return n}}return n}),define("mout/array/map",["./forEach","../function/makeIterator_"],function(e,t){function n(n,r,i){r=t(r);var s=[];return n==null?s:(e(n,function(e,t,n){s[t]=r.call(i,e,t,n)}),s)}return n}),define("mout/array/filter",["./forEach","../function/makeIterator_"],function(e,t){function n(n,r,i){r=t(r);var s=[];return e(n,function(e,t,n){r.call(i,e,t,n)&&s.push(e)}),s}return n}),define("array/insert",[],function(){return arrayInsertInto}),define("levenshtein",[],function(){function e(e,t){var n=e.length,r=t.length,i=[],s,o;if(!n)return r;if(!r)return n;for(s=0;s<=n;s++)i[s]=[s];for(o=0;o<=r;o++)i[0][o]=o;for(o=1;o<=r;o++)for(s=1;s<=n;s++)e[s-1]==t[o-1]?i[s][o]=i[s-1][o-1]:i[s][o]=Math.min(i[s-1][o],i[s][o-1],i[s-1][o-1])+1;return i[n][r]}return e}),define("has_lazy_space",[],function(){function e(e,t,n,r,i,s){return e.chars.length>r.chars.length}return e}),define("correct",{Error:"error",Right:"right",NotMatter:"not_matter"}),define("check_lazy_space",["has_lazy_space","correct"],function(e,t){function n(n,r,i,s,o,u){var a=!1;if(!e(n,r,i,s,o,u))return!1;var f=n.value.substring(s.value.length);return a&&console.log("<lazy space>",f,s,n),i.setValue(f+i.value),r.correct=t.Error,r.correctLazySpace=t.Error,r.failChars(),r.lock(),a&&console.log("<lazy space> new char for next token (",i.value.substring(f.length),") length missing: (",f.length),n.setValue(n.value.substring(0,s.value.length)),!0}return n}),define("mout/array/pluck",["./map"],function(e){function t(t,n){return e(t,n)}return t}),define("mout/array/reject",["./forEach","../function/makeIterator_"],function(e,t){function n(n,r,i){r=t(r);var s=[];return e(n,function(e,t,n){r.call(i,e,t,n)||s.push(e)}),s}return n}),define("char",["correct"],function(e){function t(t){this.value=t,this.displayValue=null,this.correct=e.Right,this._locked=!1,this.skip=!1,this.correctCharacters="-",this.correctSpace="-",this.correctReversedChars="-",this.correctMissingChars="-",this.correctAddedChars="-",this.correctTooLong="-",this.correctRandomSpace="-"}return t.prototype.toString=function(){return"<Char> {"+this.value+", correct: "+this.correct+"}"},t.prototype.lock=function(){this._locked=!0},t.prototype.isLocked=function(){return this._locked},t.prototype.equals=function(e){return e?this.value===e.value:!1},t}),define("alpha_numeric",["mout/array/filter","mout/array/forEach","mout/array/map","mout/array/reject","correct","char"],function(e,t,n,r,i,s){function o(e){this.value=e,this.correct=i.Right,this.chars=[],this.levenshtein=0,this._fixed=!1,this.updateChars(),this.correctCharacters="-",this.correctEagerSpace="-",this.correctLazySpace="-",this.correctMissingSpace="-",this.correctCheckWord="-",this.correctTooLong="-",this.correctMissing="-",this.correctDuplicate="-",this.correctRandomSpace="-",this._type=null,this.skip=!1}return o.prototype={},o.prototype.toString=function(){return"AlphaNumeric"},o.prototype.areCharsRight=function(){var e=r(this.chars,{correct:i.Right});return e.length<1},o.prototype.setValue=function(e,t){this.value=e;if(t===undefined||t===null)t=!0;t&&this.updateChars()},o.prototype.updateChars=function(){this.chars=n(this.value.split(""),function(e){return new s(e)})},o.prototype.failChars=function(e){e||(e=i.Error),t(this.chars,function(t){t.correct=e})},o.prototype.equals=function(e){return e?this.value===e.value:!1},o.prototype.lock=function(){this._fixed=!0},o.prototype.isLocked=function(){return this._fixed},o.prototype.duplicate=function(){return new o(this.value)},o.prototype.is=function(e){return this instanceof e},o}),define("has_missing_space",["mout/string/startsWith","mout/array/filter","mout/array/pluck","mout/array/map","levenshtein","alpha_numeric"],function(e,t,n,r,i,s){function o(e,t,r,o,u,a,f,l){if(!a)return{hasMissingSpace:!1,tokens:[]};var c=[],h="";for(var p=l,d=null;d=f[p];p++){if(h.length>=e.chars.length)break;d instanceof s&&(h+=d.value,c.push(d))}if(c.length<2)return{hasMissingSpace:!1,tokens:[]};var v=n(c,"value").join(""),m=i(v,e.value)<2*c.length;return{hasMissingSpace:m,tokens:c}}return o}),define("check_missing_sentence",["mout/array/forEach","levenshtein","array/insert","correct"],function(e,t,n,r){function i(i,s,o,u){var a=!1,f=[],l=o,c=0,h=i[u+2],p=2;s[o].chars.length<3&&(p=1);if(t(s[o].value,i[u].value+h.value)<p)return 0;if(t(i[o].value,s[o].value)<=p)return 0;for(var d=u;d<i.length;d++){var v=i[d],m=s[l];if(!v||!m)return 0;if(d-u>=25)return a&&console.log("<missing sentence> too many characters: i:",d," original: ",u),0;a&&console.log("<missing sentence> org(",d,"): ",v.value," input(",l,"): ",m.value);if(c>=5){var g=o,y=f.shift();return y&&(a&&console.log("<missing sentence> first Token, mark as Correct.Error,",y),y=y.duplicate(),y.correct=r.Error,y.correctMissing=r.Error,y.failChars(),y.lock(),a&&console.log("<missing sentence> insert missing:(",g,")",y.value),n(s,g++,y)),e(f,function(e){var t=e.duplicate();t.correct=r.NotMatter,t.correctMissing=r.NotMatter,t.failChars(r.NotMatter),t.lock(),a&&console.log("<missing sentence> insert missing:(",g,")",t.value),n(s,g++,t)}),f.length+1}t(v.value,m.value)>=2?(c=0,a&&console.log("<missing sentence> push missing token:",v.value),f.push(v)):(l++,c++)}}return i}),define("check_duplicate_sentence",["mout/array/forEach","levenshtein","correct"],function(e,t,n){function r(r,i,s,o){var u=!1,a=[],f=o,l=0;for(var c=s;c<i.length;c++){var h=i[c],p=r[f];u&&console.log("inputCursor: ",c,", originalCursor: ",f,", inputToken:",h.value,", originalToken:",p.value);if(!h||!p)continue;if(l>=5){e(a,function(e){e.correctDuplicate=n.NotMatter,e.correct=n.NotMatter,e.skip=!0,e.failChars(n.NotMatter),e.lock(),u&&console.log("<duplicate sentence> marked as skip: ",e.value)});var d=a.shift();return d&&(d.correct=n.Error,d.correctDuplicate=n.Error,d.failChars(n.Error),s+=1),s+a.length}t(h.value,p.value)>=2?(u&&console.log("duplicate:",h.value,p.value),a.push(h),l=0):(f++,l++)}return s}return r}),define("array/remove",[],function(){function e(e,t){return e.splice(e.indexOf(t),1)}return e}),define("mout/lang/kindOf",[],function(){function r(r){return r===null?"Null":r===n?"Undefined":e.exec(t.call(r))[1]}var e=/^\[object (.*)\]$/,t=Object.prototype.toString,n;return r}),define("mout/lang/isKind",["./kindOf"],function(e){function t(t,n){return e(t)===n}return t}),define("mout/lang/isArray",["./isKind"],function(e){var t=Array.isArray||function(t){return e(t,"Array")};return t}),define("mout/array/flatten",["../lang/isArray"],function(e){function t(n,r,i){if(i===0){r.push.apply(r,n);return}var s,o=-1,u=n.length;while(++o<u)s=n[o],e(s)?t(s,r,i-1):r.push(s);return r}function n(e,n){return t(e,[],n?1:-1)}return n}),define("mout/object/mixIn",["./forOwn"],function(e){function t(t,r){var i=0,s=arguments.length,o;while(++i<s)o=arguments[i],o!=null&&e(o,n,t);return t}function n(e,t){this[t]=e}return t}),define("mout/lang/createObject",["../object/mixIn"],function(e){function t(t,n){function r(){}return r.prototype=t,e(new r,n)}return t}),define("mout/lang/inheritPrototype",["./createObject"],function(e){function t(t,n){var r=e(n.prototype);r.constructor=t,t.prototype=r}return t}),define("non_alpha_numeric",["correct","alpha_numeric","mout/lang/inheritPrototype"],function(e,t,n){function r(t){this.value=t,this.correct=e.Right,this.chars=[],this.levenshtein=0,this._fixed=!1,this.updateChars(),this.correctCharacters="-",this.correctEagerSpace="-",this.correctLazySpace="-",this.correctMissingSpace="-",this.correctCheckWord="-",this.correctTooLong="-",this.correctMissing="-",this.correctDuplicate="-",this.correctRandomSpace="-",this.skip=!1}return n(r,t),r.prototype.toString=function(){return"NonAlphaNumeric"},r.prototype.duplicate=function(){return new r(this.value)},r}),define("check_random_space",["array/remove","mout/array/forEach","mout/array/map","mout/array/flatten","mout/array/filter","non_alpha_numeric","alpha_numeric","correct"],function(e,t,n,r,i,s,o,u){function a(e){return e instanceof o}function f(o,f){var l=!1;l&&console.log("<random space> tokens:",n(f,"value"));var c=f.shift();t(f,function(t){t instanceof s&&(t.correct=u.Error,t.failChars(),t.lock()),e(o,t)}),t(f,function(e){t(e.chars,function(t){e instanceof s&&(t.correctRandomSpace=u.Error,t.correct=u.Error,t.skip=!0,t.lock()),c.chars.push(t)})});var h=n(r(n(i(f,a),"chars")),"value").join("");c.setValue(c.value+h,!1),c.correct=u.Error,c.correctRandomSpace=u.Error,l&&console.log("<random space> new token:",c.value)}return f}),define("is_random_space",["levenshtein","mout/array/filter","mout/array/map","mout/array/flatten","alpha_numeric"],function(e,t,n,r,i){function s(s,o,u){var a=!1;if(!s)return{isDetected:!1,token:null};var f=[],l=0;for(var c=u;c<o.length;c++){var h=o[c];h instanceof i&&(l+=h.chars.length),f.push(h);if(l>=s.value.length){a&&console.log("<is random space>",f);break}}var p=n(r(n(t(f,function(e){return e instanceof i}),"chars")),"value").join("");return a&&console.log("<is random space> guess value:",p),{isDetected:e(s.value,p)<=2,tokens:f}}return s}),define("check_word",["mout/string/startsWith","mout/string/endsWith","mout/array/map","mout/array/filter","array/insert","levenshtein","has_lazy_space","check_lazy_space","has_missing_space","check_missing_sentence","check_duplicate_sentence","check_random_space","is_random_space","non_alpha_numeric","alpha_numeric","correct"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v){function m(m,g){var y=!1,b=m.length;for(var w=0,E=0;w<g.length&&w<b;w++){var S=g[w],x=m[E];y&&console.log("<check word> cursor (orig, in):",E,w,", in: (",S.value,"), orig: (",x.value,")"),S.levenshtein=s(S.value,x.value);if(S.isLocked()){E++;continue}if(S.skip)continue;if(S.equals(x)){S.correct=v.Right,E++;continue}var T=g[w-1],N=g[w+1],C=g[w+2],k=m[E-1],L=m[E+1],A=m[E+2],O=m[E+4];if(N instanceof p&&S.chars.length<x.chars.length&&C&&!C.equals(A)){var M=h(x,g,w);if(M.isDetected){c(g,M.tokens),E++;continue}}var _=f(m,g,w,E);if(_>0){E+=_,w+=_-1;continue}var D=l(m,g,w,E);if(D>w){y&&console.log("<check word> old input cursor: (",w,") new: (",D,")"),w=D-1;continue}if(S&&x&&C&&N instanceof p&&L instanceof p&&C&&A&&!C.equals(A)&&t(A.value,C.value)&&e(S.value,x.value)){var P=o(S,N,C,x,L,A);if(P){u(S,N,C,x,L,A),E++;continue}}var H=a(S,C,x,L,A,O,m,E);if(H.hasMissingSpace){var B=S.value,j=B.substr(B.indexOf(A.value)),F=B.replace(j,"");S.setValue(F),S.correct=S.equals(x)?v.Right:v.Error,S.correctMissingSpace=S.equals(x)?v.Right:v.Error;var I=new p(m[E+1].value);I.correct=v.Error,I.correctMissingSpace=v.Error,I.lock(),I.failChars(),i(g,w+1,I),y&&(console.log("<missing space> insert space:",I.value," at pointer:",w),console.log("<missing space> correct:",n(g,"value")));var q=new d(j);q.correct=v.Error,q.correctMissingSpace=v.Error,i(g,w+2,q),y&&(console.log("<missing space> correct:",n(g,"value")),console.log("<missing space> new token inserted result:",q.value,", at pointer:",w+1),console.log("<missing space><message info> (cursor original position: ",E),console.log("<missing space><message info> (cursor input position: ",w)),E+=2,w+=1;continue}S.correct=v.Error,S.correctCheckWord=v.Error,E++,y&&console.log("<checkWord_after><pointer",E,w,"> input: ",S.value,"original: ",x.value)}var R=r(g,"skip").length;y&&console.log("<check word, too many tokens> count skipped tokens",R,"original tokens count:",b);for(var U=b+R,z=g.length;U<z;U++){var W=g[U];y&&console.log("<check word, too many>:",W.value),W.correct=v.Error,W.correctTooLong=v.Error,W.failChars(),W.lock()}}return m}),define("array/move",[],function(){function e(e,t,n){while(t<0)t+=e.length;while(n<0)n+=e.length;if(n>=e.length){var r=n-e.length;while(r-- +1)e.push(undefined)}return e.splice(n,0,e.splice(t,1)[0]),e}return e}),define("check_characters",["array/insert","array/move","mout/array/map","char","correct"],function(e,t,n,r,i){function s(s,o){var u=!1;if(s.correct===i.Right||s.isLocked()||s.skip)return;var a=null;for(var f=0,l=0;f<s.chars.length;f++){var c=s.chars[f],h=o.chars[l];u&&console.log("<char compare> in:("+c.value+")("+f+") orig:("+(h?h.value:undefined)+")("+l+")");if(c.skip)continue;if(c.isLocked()){l++;continue}if(!h){u&&console.log("<check chars> input token is too long"),c.correct=i.Error,c.correctCharacters=i.Error,l++;continue}if(c.equals(h)){a===null&&(a=f),c.correct=i.Right,c.correctCharacters=i.Right,l++;continue}if(s.equals(o))return;var p=o.chars[l+1],d=s.chars[f+1],v=o.chars[l+2],m=s.chars[f+2];if(p instanceof r&&p.equals(c)&&v instanceof r&&v.equals(d)){u&&console.log("<missing char> original:",h.value),c.correct=i.Right,c.correctMissingChars=i.Right;var g=new r(h.value);g.displayValue="*",g.correct=i.Error,g.correctMissingChars=i.Error,g.lock(),e(s.chars,f,g);var y=n(s.chars,"value").join("");s.setValue(y,!1),u&&console.log("<missing char> after insert:"+n(s.chars,"value").join("")),l++;continue}if(c.equals(p)&&h.equals(d)){c.correctReversedChars=i.Error,c.correct=i.Error,d.correctReversedChars=i.NotMatter,d.correct=i.NotMatter,c.lock(),d.lock(),u&&console.log("<reversed chars (before)>",s.chars,n(s.chars,"value")),t(s.chars,f,f+1);var b=n(s.chars,"value").join("");s.setValue(b,!1),u&&console.log("<reversed chars (after)>",b),f+=1,l+=2;continue}if(d instanceof r&&d.equals(h)&&s.chars.length>o.chars.length){u&&console.log("<random added wrong char, and should not be here>",c.value),c.correct=i.Error,c.correctAddedChars=i.Error,c.lock();continue}c.correct=i.Error,c.correctCharacters=i.Error,l++}if(s.equals(o)||s.chars.length===o.chars.length)return;u&&console.log("<extra chars in input> input: ("+s.value+") original:("+o.value+") <!disabled!>");for(var w=s.chars.length;w<o.chars.length;w++){var E=new r("*");E.correct=i.Error,E.correctMissingChars=i.Error,E.skip=!0,E.lock(),e(s.chars,w,E)}var S=n(s.chars,"value").join("");s.setValue(S,!1)}return s}),define("check_eager_space",["correct"],function(e){function t(t,n,r,i,s,o){var u=!1;if(t.chars.length>i.chars.length)return;if(r.chars.length<o.chars.length)return;var a=r.value.substring(0,r.value.length-o.value.length);u&&console.log("<eager space> missing:(",a,") orig previous: (",i.value,") in previous: (",t.value,")"),t.setValue(t.value+a),n.correct=e.Error,n.correctEagerSpace=e.Error,n.failChars(),n.lock(),u&&console.log("<eager space> new value next token: (",r.value.substring(a.length),") length missing: (",a.length,")"),r.setValue(r.value.substring(a.length))}return t}),define("array/find_next_good_token",[],function(){function e(e,t){for(var n=t;n<e.length;n++){var r=e[n];if(!r.skip&&!r.isLocked())return{token:r,index:n}}return{token:null,index:-1}}return e}),define("array/find_previous_good_token",[],function(){function e(e,t){for(var n=t;n>-1;n--){var r=e[n];if(!r.skip&&!r.isLocked())return{token:r,index:n}}return{token:null,index:-1}}return e}),define("check_eager_spaces",["check_eager_space","check_lazy_space","mout/string/startsWith","array/find_next_good_token","array/find_previous_good_token","alpha_numeric","non_alpha_numeric"],function(e,t,n,r,i,s,o){function u(t,u){for(var a=0,f=t.length;a<f;a++){var l=t[a],c=u[a];if(!(l instanceof o&&c instanceof o))continue;if(l.skip)continue;var h=i(t,a).token,p=r(t,a).token,d=u[a-1],v=u[a+1];if(!h||!p||!d||!v)continue;if(!(h instanceof s&&p instanceof s))continue;if(l.equals(c))continue;if(n(p.value,v.value))continue;e(h,l,p,d,c,v)}}return u}),define("check_for_spaces",["check_characters","mout/array/forEach","non_alpha_numeric","char","correct"],function(e,t,n,r,i){function s(e,t){if(!(e instanceof n&&t instanceof n))throw new Error("Input and original token: ("+e+") should instance of NonAlphaNumeric.");var s=!1;if(e.isLocked())return;var u=[];for(var a=0,f=e.chars.length;a<f;a++){var l=e.chars[a],c=t.chars[a],h=e.chars[a+1],p=t.chars[a+1];l.value===" "&&l.correct===i.Error&&u.push(l);if(!(h instanceof r)||h.value!==" "||h.correct!==i.Error)o(u),u=[];s&&console.log("check spaces",u,l,h)}}function o(e){var n=!1;n&&console.log("check for space....",e);if(e.length<1)return!1;var r=e.shift();return r&&(r.correct=i.Error,r.correctSpace=i.Error),t(e,function(e){e.isLocked()||(e.correct=i.NotMatter,e.correctSpace=i.NotMatter)}),!0}return s}),define("is_alpha_numeric",[],function(){function t(t){return e.test(t)}var e=/^[a-zA-Z0-9\u00E0-\u00FC]+$/;return t}),define("mout/array/indexOf",[],function(){function e(e,t,n){n=n||0;var r=e.length,i=n<0?r+n:n;while(i<r){if(e[i]===t)return i;i+=1}return-1}return e}),define("mout/array/contains",["./indexOf"],function(e){function t(t,n){return e(t,n)!==-1}return t}),define("mout/string/interpolate",["../lang/toString"],function(e){function n(n,r,i){n=e(n);var s=function(t,n){return n in r?e(r[n]):""};return n.replace(i||t,s)}var t=/\{\{(\w+)\}\}/g;return n}),define("mout/lang/toArray",["./kindOf"],function(e){function n(n){var r=[],i=e(n),s;if(n!=null)if(n.length==null||i==="String"||i==="Function"||i==="RegExp"||n===t)r[r.length]=n;else{s=n.length;while(s--)r[s]=n[s]}return r}var t=this;return n}),define("mout/string/replace",["../lang/toString","../lang/toArray"],function(e,t){function n(n,r,i){n=e(n),r=t(r),i=t(i);var s=r.length,o=i.length;if(o!==1&&s!==o)throw new Error("Unequal number of searches and replacements");var u=-1;while(++u<s)n=n.replace(r[u],i[o===1?0:u]);return n}return n}),define("space2underscore",["mout/string/replace"],function(e){function r(r){return e(r,t,n)}var t=" ",n="_";return r}),define("build_dom",["mout/string/interpolate","mout/array/forEach","space2underscore","jquery","correct"],function(e,t,n,r,i){function s(s,o){o!==!0&&(o=!1);var u=document.createDocumentFragment();return t(s,function(s){var a=r("<span>");o&&a.attr("data-chars-correct",s.correct),a.addClass(s.areCharsRight()?i.Right:s.correct);if(o){var f=e(" correct: {{correct}}\n characters: {{characters}}\n EagerSpace: {{EagerSpace}}\n LazySpace: {{LazySpace}}\n MissingSpace: {{MissingSpace}}\n CheckWord: {{CheckWord}}\n TooLong: {{TooLong}}\n Missing: {{Missing}}\n Duplicate: {{Duplicate}}",{correct:s.correct,characters:s.correctCharacters,EagerSpace:s.correctEagerSpace,LazySpace:s.correctLazySpace,MissingSpace:s.correctMissingSpace,CheckWord:s.correctCheckWord,TooLong:s.correctTooLong,Missing:s.correctMissing,Duplicate:s.correctDuplicate});a.attr({"data-fixed":s._fixed,title:f,"data-type":s,"data-skip":s.skip})}t(s.chars,function(t){var i=r("<span>",{"class":t.correct}).text(t.displayValue===null?n(t.value):n(t.displayValue));a.append(i);if(o){var s=e(" correct: {{correct}}\n characters: {{characters}}\n space: {{space}}\n reversed: {{reversed}}\n missing: {{missing}}\n added: {{added}}\n tooLong: {{tooLong}}\n randomSpace: {{randomSpace}}",{correct:t.correct,characters:t.correctCharacters,space:t.correctSpace,reversed:t.correctReversedChars,missing:t.correctMissingChars,added:t.correctAddedChars,tooLong:t.correctTooLong,randomSpace:t.correctRandomSpace});i.attr({title:s,"data-skip":t.skip})}}),u.appendChild(a[0])}),u}return s}),define("matcher",[],function(){function e(e,t){this.match=t,this.type=e}return e}),define("mout/array/findIndex",["../function/makeIterator_"],function(e){function t(t,n,r){n=e(n);var i=-1,s=t.length;while(++i<s)if(n.call(r,t[i],i,t))return i;return-1}return t}),define("mout/array/find",["./findIndex"],function(e){function t(t,n,r){var i=e(t,n,r);return i>=0?t[i]:void 0}return t}),define("tokenizer",["mout/array/forEach","mout/array/find"],function(e,t){function n(e){if(!(this instanceof n))return new n(e);this._str=e,this._tokens=[],this._matchers=[]}return n.prototype.addMatcher=function(e){this._matchers.push(e)},n.prototype.getTokens=function(){var e=null,t=null;for(var n=0,r=this._str.length;n<r;n++){var i=this._str.charAt(n),s=this.findMatcher(i);if(t===null){e=i,t=s;continue}if(t===s){e+=i;continue}e!==""&&e!==null&&e!==undefined&&(this._tokens.push(new t.type(e)),t=s,e=i)}return e!==""&&e!==null&&e!==undefined&&this._tokens.push(new t.type(e)),this._tokens},n.prototype.findMatcher=function(e){if(e===null)return null;var n=t(this._matchers,function(t){return t.match(e)});return n?n:null},n}),define("count_score",["mout/array/forEach","mout/array/filter","correct"],function(e,t,n){function r(r){var i=0,s=0,o=0,u=0;return e(r,function(e){var r=!1;e.correct===n.Error?(i+=1,r=!0):e.correct===n.NotMatter?s+=1:e.correct===n.Right&&(o+=1),r||(u+=t(e.chars,{correctRandomSpace:n.Error}).length)}),{failures:i+u,notMatter:s,right:o}}return r}),define("global",["check_word","check_characters","check_eager_spaces","check_for_spaces","is_alpha_numeric","mout/array/forEach","mout/array/contains","build_dom","matcher","tokenizer","count_score","alpha_numeric","non_alpha_numeric","correct","jquery"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d){function y(i,o){v&&console.time("Tokenizer input & original");var a=new f(i);a.addMatcher(m),a.addMatcher(g);var c=a.getTokens(),y=new f(o);y.addMatcher(m),y.addMatcher(g);var b=y.getTokens();v&&(window._i=b,console.timeEnd("Tokenizer input")),v&&console.time("check alphaNumeric input"),e(c,b),v&&console.timeEnd("check alphaNumeric input"),v&&console.time("check eager and lazy spaces"),n(b,c),v&&console.timeEnd("check eager and lazy spaces"),v&&console.time("check characters input");for(var w=0,E=b.length;w<E;w++){var S=b[w],x=c[w];if(!x)break;v&&console.log("check chars1",S.value,x.value),!S.skip&&S.correct===p.Error&&(v&&console.log("check chars2",S.value,x.value),t(S,x),S instanceof h&&x instanceof h&&r(S,x))}v&&console.timeEnd("check characters input");var T=b[b.length-1];T&&(T.correct=p.Right,s(T.chars,function(e){e.correct=p.Right})),v&&console.time("build dom");var N=u(b,v);v&&console.timeEnd("build dom"),v&&console.time("count failures");var C=l(b);return v&&console.timeEnd("count failures"),v&&console.time("render input"),d(".column.output.gwt-HTML").html(N),d("#count_failures").text(C.failures),v&&console.timeEnd("render input"),{output:d("<p>").append(N).html(),failures:C.failures}}var v=!1,m=new a(c,function(e){return e===""||i(e)}),g=new a(h,function(e){var t=[":",";","&","'",'"',"!","?",",",".","-","(",")"];return o(t,e)||d.trim(e)===""});d(document).ready(function(){var e=d(".column.example textarea"),t=d(".column.input textarea").keydown(function(e){e.keyCode===13&&e.preventDefault()}),n=d(".column.output.gwt-HTML"),r=d("#debug");r.change(function(){v=r.is(":checked"),v?e.removeProp("readOnly"):e.prop("readOnly","readOnly")}).trigger("change"),d(window).resize(function(){var e=(d(window).width()-40)/3,t=d(window).height()-40;d(".column").width(e).height(t),d(".column textarea").width(e-2-80).height(t-2-80),n.width(e-2-80).height(t-2-80)}).trigger("resize"),e.keyup(function(){y(e.val(),t.val())}).trigger("keyup"),t.keyup(function(){y(e.val(),t.val())}).trigger("keyup")}),window.execute=y});