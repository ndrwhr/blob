
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};// gl-matrix 1.3.7 - https://github.com/toji/gl-matrix/blob/master/LICENSE.md
(function(w,D){"object"===typeof exports?module.exports=D(global):"function"===typeof define&&define.amd?define([],function(){return D(w)}):D(w)})(this,function(w){function D(a){return o=a}function G(){return o="undefined"!==typeof Float32Array?Float32Array:Array}var E={};(function(){if("undefined"!=typeof Float32Array){var a=new Float32Array(1),b=new Int32Array(a.buffer);E.invsqrt=function(c){a[0]=c;b[0]=1597463007-(b[0]>>1);var d=a[0];return d*(1.5-0.5*c*d*d)}}else E.invsqrt=function(a){return 1/
Math.sqrt(a)}})();var o=null;G();var r={create:function(a){var b=new o(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b},createFrom:function(a,b,c){var d=new o(3);d[0]=a;d[1]=b;d[2]=c;return d},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])},add:function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];
return c},subtract:function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c},multiply:function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b},scale:function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c},normalize:function(a,b){b||(b=a);var c=
a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(!g)return b[0]=0,b[1]=0,b[2]=0,b;if(1===g)return b[0]=c,b[1]=d,b[2]=e,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b},cross:function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c},length:function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)},squaredLength:function(a){var b=a[0],c=a[1],a=a[2];return b*b+c*c+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)}},H=null,y=new o(4);r.unproject=function(a,b,c,d,e){e||(e=a);H||(H=x.create());var g=H;y[0]=2*(a[0]-d[0])/d[2]-1;y[1]=2*(a[1]-d[1])/d[3]-1;y[2]=
2*a[2]-1;y[3]=1;x.multiply(c,b,g);if(!x.inverse(g))return null;x.multiplyVec4(g,y);if(0===y[3])return null;e[0]=y[0]/y[3];e[1]=y[1]/y[3];e[2]=y[2]/y[3];return e};var L=r.createFrom(1,0,0),M=r.createFrom(0,1,0),N=r.createFrom(0,0,1),z=r.create();r.rotationTo=function(a,b,c){c||(c=k.create());var d=r.dot(a,b);if(1<=d)k.set(O,c);else if(-0.999999>d)r.cross(L,a,z),1.0E-6>r.length(z)&&r.cross(M,a,z),1.0E-6>r.length(z)&&r.cross(N,a,z),r.normalize(z),k.fromAngleAxis(Math.PI,z,c);else{var d=Math.sqrt(2*(1+
d)),e=1/d;r.cross(a,b,z);c[0]=z[0]*e;c[1]=z[1]*e;c[2]=z[2]*e;c[3]=0.5*d;k.normalize(c)}1<c[3]?c[3]=1:-1>c[3]&&(c[3]=-1);return c};r.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var A={create:function(a){var b=new o(9);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]):b[0]=b[1]=b[2]=b[3]=b[4]=b[5]=b[6]=b[7]=b[8]=0;return b},createFrom:function(a,b,c,d,e,g,f,h,j){var i=new o(9);i[0]=a;i[1]=b;i[2]=c;i[3]=d;i[4]=e;i[5]=g;i[6]=f;i[7]=h;i[8]=j;return i},
determinant:function(a){var b=a[3],c=a[4],d=a[5],e=a[6],g=a[7],f=a[8];return a[0]*(f*c-d*g)+a[1]*(-f*b+d*e)+a[2]*(g*b-c*e)},inverse:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=m*f-h*i,C=-m*g+h*j,q=i*g-f*j,n=c*l+d*C+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=C*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],
f=a[3],h=a[4],j=a[5],i=a[6],m=a[7],a=a[8],l=b[0],C=b[1],q=b[2],n=b[3],k=b[4],p=b[5],o=b[6],s=b[7],b=b[8];c[0]=l*d+C*f+q*i;c[1]=l*e+C*h+q*m;c[2]=l*g+C*j+q*a;c[3]=n*d+k*f+p*i;c[4]=n*e+k*h+p*m;c[5]=n*g+k*j+p*a;c[6]=o*d+s*f+b*i;c[7]=o*e+s*h+b*m;c[8]=o*g+s*j+b*a;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[3]+a[6];c[1]=d*a[1]+b*a[4]+a[7];return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=d*a[0]+e*a[3]+b*a[6];c[1]=d*a[1]+e*a[4]+b*a[7];c[2]=
d*a[2]+e*a[5]+b*a[8];return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])},identity:function(a){a||(a=A.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;
a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b},toMat4:function(a,b){b||(b=x.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b},str:function(a){return"["+a[0]+", "+a[1]+
", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"}},x={create:function(a){var b=new o(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b},createFrom:function(a,b,c,d,e,g,f,h,j,i,m,l,C,q,n,k){var p=new o(16);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=g;p[6]=f;p[7]=h;p[8]=j;p[9]=i;p[10]=m;p[11]=l;p[12]=C;p[13]=q;p[14]=n;p[15]=k;return p},set:function(a,
b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])&&1.0E-6>Math.abs(a[9]-b[9])&&1.0E-6>
Math.abs(a[10]-b[10])&&1.0E-6>Math.abs(a[11]-b[11])&&1.0E-6>Math.abs(a[12]-b[12])&&1.0E-6>Math.abs(a[13]-b[13])&&1.0E-6>Math.abs(a[14]-b[14])&&1.0E-6>Math.abs(a[15]-b[15])},identity:function(a){a||(a=x.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=
a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b},determinant:function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],j=a[7],i=a[8],m=a[9],l=a[10],C=a[11],q=a[12],n=a[13],k=a[14],a=a[15];return q*m*h*e-i*n*h*e-q*f*l*e+g*n*l*e+i*f*k*e-g*m*k*e-q*m*d*j+i*n*d*j+q*c*l*j-b*n*l*j-i*c*k*j+b*m*k*j+q*f*d*C-g*n*d*C-q*c*h*C+b*n*h*C+
g*c*k*C-b*f*k*C-i*f*d*a+g*m*d*a+i*c*h*a-b*m*h*a-g*c*l*a+b*f*l*a},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=a[9],k=a[10],q=a[11],n=a[12],o=a[13],p=a[14],r=a[15],s=c*h-d*f,v=c*j-e*f,t=c*i-g*f,u=d*j-e*h,w=d*i-g*h,x=e*i-g*j,y=m*o-l*n,z=m*p-k*n,F=m*r-q*n,A=l*p-k*o,D=l*r-q*o,E=k*r-q*p,B=s*E-v*D+t*A+u*F-w*z+x*y;if(!B)return null;B=1/B;b[0]=(h*E-j*D+i*A)*B;b[1]=(-d*E+e*D-g*A)*B;b[2]=(o*x-p*w+r*u)*B;b[3]=(-l*x+k*w-q*u)*B;b[4]=(-f*E+j*F-i*z)*B;b[5]=
(c*E-e*F+g*z)*B;b[6]=(-n*x+p*t-r*v)*B;b[7]=(m*x-k*t+q*v)*B;b[8]=(f*D-h*F+i*y)*B;b[9]=(-c*D+d*F-g*y)*B;b[10]=(n*w-o*t+r*s)*B;b[11]=(-m*w+l*t-q*s)*B;b[12]=(-f*A+h*z-j*y)*B;b[13]=(c*A-d*z+e*y)*B;b[14]=(-n*u+o*v-p*s)*B;b[15]=(m*u-l*v+k*s)*B;return b},toRotationMat:function(a,b){b||(b=x.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b},toMat3:function(a,b){b||(b=A.create());b[0]=
a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b},toInverseMat3:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],j=a[8],i=a[9],m=a[10],l=m*f-h*i,k=-m*g+h*j,q=i*g-f*j,n=c*l+d*k+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=k*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],j=a[5],
i=a[6],m=a[7],l=a[8],k=a[9],q=a[10],n=a[11],o=a[12],p=a[13],r=a[14],a=a[15],s=b[0],v=b[1],t=b[2],u=b[3];c[0]=s*d+v*h+t*l+u*o;c[1]=s*e+v*j+t*k+u*p;c[2]=s*g+v*i+t*q+u*r;c[3]=s*f+v*m+t*n+u*a;s=b[4];v=b[5];t=b[6];u=b[7];c[4]=s*d+v*h+t*l+u*o;c[5]=s*e+v*j+t*k+u*p;c[6]=s*g+v*i+t*q+u*r;c[7]=s*f+v*m+t*n+u*a;s=b[8];v=b[9];t=b[10];u=b[11];c[8]=s*d+v*h+t*l+u*o;c[9]=s*e+v*j+t*k+u*p;c[10]=s*g+v*i+t*q+u*r;c[11]=s*f+v*m+t*n+u*a;s=b[12];v=b[13];t=b[14];u=b[15];c[12]=s*d+v*h+t*l+u*o;c[13]=s*e+v*j+t*k+u*p;c[14]=s*g+
v*i+t*q+u*r;c[15]=s*f+v*m+t*n+u*a;return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c},multiplyVec4:function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c},translate:function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,j,i,m,l,k,q,
n,o,p;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];j=a[3];i=a[4];m=a[5];l=a[6];k=a[7];q=a[8];n=a[9];o=a[10];p=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=j;c[4]=i;c[5]=m;c[6]=l;c[7]=k;c[8]=q;c[9]=n;c[10]=o;c[11]=p;c[12]=g*d+i*e+q*b+a[12];c[13]=f*d+m*e+n*b+a[13];c[14]=h*d+l*e+o*b+a[14];c[15]=j*d+k*e+p*b+a[15];return c},scale:function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=
d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c},rotate:function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,j,i,m,l,k,q,n,o,p,r,s,v,t,u,w,x,y,z,A;if(!f)return null;1!==f&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);j=Math.cos(b);i=1-j;b=a[0];
f=a[1];m=a[2];l=a[3];k=a[4];q=a[5];n=a[6];o=a[7];p=a[8];r=a[9];s=a[10];v=a[11];t=e*e*i+j;u=g*e*i+c*h;w=c*e*i-g*h;x=e*g*i-c*h;y=g*g*i+j;z=c*g*i+e*h;A=e*c*i+g*h;e=g*c*i-e*h;g=c*c*i+j;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+k*u+p*w;d[1]=f*t+q*u+r*w;d[2]=m*t+n*u+s*w;d[3]=l*t+o*u+v*w;d[4]=b*x+k*y+p*z;d[5]=f*x+q*y+r*z;d[6]=m*x+n*y+s*z;d[7]=l*x+o*y+v*z;d[8]=b*A+k*e+p*g;d[9]=f*A+q*e+r*g;d[10]=m*A+n*e+s*g;d[11]=l*A+o*e+v*g;return d},rotateX:function(a,b,c){var d=Math.sin(b),
b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+j*d;c[5]=g*b+i*d;c[6]=f*b+m*d;c[7]=h*b+l*d;c[8]=e*-d+j*b;c[9]=g*-d+i*b;c[10]=f*-d+m*b;c[11]=h*-d+l*b;return c},rotateY:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=
a[15]):c=a;c[0]=e*b+j*-d;c[1]=g*b+i*-d;c[2]=f*b+m*-d;c[3]=h*b+l*-d;c[8]=e*d+j*b;c[9]=g*d+i*b;c[10]=f*d+m*b;c[11]=h*d+l*b;return c},rotateZ:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[4],i=a[5],m=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+j*d;c[1]=g*b+i*d;c[2]=f*b+m*d;c[3]=h*b+l*d;c[4]=e*-d+j*b;c[5]=g*-d+i*b;c[6]=f*-d+m*b;c[7]=h*-d+l*b;return c},frustum:function(a,b,c,d,e,g,f){f||
(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2*e/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2*e/j;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/j;f[10]=-(g+e)/i;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(2*g*e)/i;f[15]=0;return f},perspective:function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return x.frustum(-b,b,-a,a,c,d,e)},ortho:function(a,b,c,d,e,g,f){f||(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/j;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/i;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/j;f[14]=
-(g+e)/i;f[15]=1;return f},lookAt:function(a,b,c,d){d||(d=x.create());var e,g,f,h,j,i,m,l,k=a[0],o=a[1],a=a[2];f=c[0];h=c[1];g=c[2];m=b[0];c=b[1];e=b[2];if(k===m&&o===c&&a===e)return x.identity(d);b=k-m;c=o-c;m=a-e;l=1/Math.sqrt(b*b+c*c+m*m);b*=l;c*=l;m*=l;e=h*m-g*c;g=g*b-f*m;f=f*c-h*b;(l=Math.sqrt(e*e+g*g+f*f))?(l=1/l,e*=l,g*=l,f*=l):f=g=e=0;h=c*f-m*g;j=m*e-b*f;i=b*g-c*e;(l=Math.sqrt(h*h+j*j+i*i))?(l=1/l,h*=l,j*=l,i*=l):i=j=h=0;d[0]=e;d[1]=h;d[2]=b;d[3]=0;d[4]=g;d[5]=j;d[6]=c;d[7]=0;d[8]=f;d[9]=
i;d[10]=m;d[11]=0;d[12]=-(e*k+g*o+f*a);d[13]=-(h*k+j*o+i*a);d[14]=-(b*k+c*o+m*a);d[15]=1;return d},fromRotationTranslation:function(a,b,c){c||(c=x.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,j=e+e,i=g+g,a=d*h,m=d*j,d=d*i,k=e*j,e=e*i,g=g*i,h=f*h,j=f*j,f=f*i;c[0]=1-(k+g);c[1]=m+f;c[2]=d-j;c[3]=0;c[4]=m-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+j;c[9]=e-h;c[10]=1-(a+k);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+
a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"}},k={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>
Math.abs(a[3]-b[3])},identity:function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a}},O=k.identity();k.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};k.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]};k.inverse=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],c=(c=c*c+d*d+e*e+g*g)?1/c:0;if(!b||a===b)return a[0]*=-c,a[1]*=-c,a[2]*=-c,a[3]*=
c,a;b[0]=-a[0]*c;b[1]=-a[1]*c;b[2]=-a[2]*c;b[3]=a[3]*c;return b};k.conjugate=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};k.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};k.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(0===f)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};k.add=function(a,b,c){if(!c||
a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a[3]+=b[3],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c};k.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],j=b[2],b=b[3];c[0]=d*b+a*f+e*j-g*h;c[1]=e*b+a*h+g*f-d*j;c[2]=g*b+a*j+d*h-e*f;c[3]=a*b-d*f-e*h-g*j;return c};k.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],j=a*d+f*g-h*e,i=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=j*a+d*-b+i*-h-k*-f;c[1]=i*a+
d*-f+k*-b-j*-h;c[2]=k*a+d*-h+j*-f-i*-b;return c};k.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a[3]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c};k.toMat3=function(a,b){b||(b=A.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(i+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(i+l);return b};k.toMat4=function(a,b){b||(b=x.create());var c=a[0],d=a[1],e=a[2],g=
a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(i+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(i+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};k.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(1<=Math.abs(e))return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(0.001>Math.abs(f))return d[0]=0.5*a[0]+0.5*b[0],d[1]=0.5*a[1]+0.5*b[1],
d[2]=0.5*a[2]+0.5*b[2],d[3]=0.5*a[3]+0.5*b[3],d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};k.fromRotationMatrix=function(a,b){b||(b=k.create());var c=a[0]+a[4]+a[8],d;if(0<c)d=Math.sqrt(c+1),b[3]=0.5*d,d=0.5/d,b[0]=(a[7]-a[5])*d,b[1]=(a[2]-a[6])*d,b[2]=(a[3]-a[1])*d;else{d=k.fromRotationMatrix.s_iNext=k.fromRotationMatrix.s_iNext||[1,2,0];c=0;a[4]>a[0]&&(c=1);a[8]>a[3*c+c]&&(c=2);var e=d[c],g=d[e];d=Math.sqrt(a[3*c+
c]-a[3*e+e]-a[3*g+g]+1);b[c]=0.5*d;d=0.5/d;b[3]=(a[3*g+e]-a[3*e+g])*d;b[e]=(a[3*e+c]+a[3*c+e])*d;b[g]=(a[3*g+c]+a[3*c+g])*d}return b};A.toQuat4=k.fromRotationMatrix;(function(){var a=A.create();k.fromAxes=function(b,c,d,e){a[0]=c[0];a[3]=c[1];a[6]=c[2];a[1]=d[0];a[4]=d[1];a[7]=d[2];a[2]=b[0];a[5]=b[1];a[8]=b[2];return k.fromRotationMatrix(a,e)}})();k.identity=function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a};k.fromAngleAxis=function(a,b,c){c||(c=k.create());var a=0.5*a,d=Math.sin(a);
c[3]=Math.cos(a);c[0]=d*b[0];c[1]=d*b[1];c[2]=d*b[2];return c};k.toAngleAxis=function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];0<c?(b[3]=2*Math.acos(a[3]),c=E.invsqrt(c),b[0]=a[0]*c,b[1]=a[1]*c,b[2]=a[2]*c):(b[3]=0,b[0]=1,b[1]=0,b[2]=0);return b};k.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};var J={create:function(a){var b=new o(2);a?(b[0]=a[0],b[1]=a[1]):(b[0]=0,b[1]=0);return b},createFrom:function(a,b){var c=new o(2);c[0]=a;c[1]=b;return c},add:function(a,b,c){c||
(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];return c},subtract:function(a,b,c){c||(c=b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;return c},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},set:function(a,b){b[0]=a[0];b[1]=a[1];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-
b[0])&&1.0E-6>Math.abs(a[1]-b[1])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];return b},normalize:function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1];0<c?(c=Math.sqrt(c),b[0]=a[0]/c,b[1]=a[1]/c):b[0]=b[1]=0;return b},cross:function(a,b,c){a=a[0]*b[1]-a[1]*b[0];if(!c)return a;c[0]=c[1]=0;c[2]=a;return c},length:function(a){var b=a[0],a=a[1];return Math.sqrt(b*b+a*a)},squaredLength:function(a){var b=a[0],a=a[1];return b*b+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],a=a[1]-b[1],b=d*d+a*a;if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/Math.sqrt(b);c[0]=d*b;c[1]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);return d},str:function(a){return"["+a[0]+", "+a[1]+"]"}},I={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];
b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},identity:function(a){a||(a=I.create());a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1];a[1]=a[2];a[2]=c;return a}b[0]=a[0];b[1]=a[2];b[2]=a[1];b[3]=a[3];return b},determinant:function(a){return a[0]*a[3]-a[2]*a[1]},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=c*g-e*
d;if(!f)return null;f=1/f;b[0]=g*f;b[1]=-d*f;b[2]=-e*f;b[3]=c*f;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3];c[0]=d*b[0]+e*b[2];c[1]=d*b[1]+e*b[3];c[2]=g*b[0]+a*b[2];c[3]=g*b[1]+a*b[3];return c},rotate:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=Math.sin(b),b=Math.cos(b);c[0]=d*b+e*f;c[1]=d*-f+e*b;c[2]=g*b+a*f;c[3]=g*-f+a*b;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[1];c[1]=d*a[2]+b*a[3];return c},scale:function(a,
b,c){c||(c=a);var d=a[1],e=a[2],g=a[3],f=b[0],b=b[1];c[0]=a[0]*f;c[1]=d*b;c[2]=e*f;c[3]=g*b;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"}},K={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):(b[0]=0,b[1]=0,b[2]=0,b[3]=0);return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},add:function(a,b,c){c||(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c},subtract:function(a,b,c){c||(c=
b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];c[3]=a[3]-b[3];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];c[3]=a[3]*b[3];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];c[2]=a[2]/b[2];c[3]=a[3]/b[3];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>
Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=-a[3];return b},length:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)},squaredLength:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return b*b+c*c+d*d+a*a},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);d[3]=a[3]+c*(b[3]-a[3]);return d},str:function(a){return"["+a[0]+", "+
a[1]+", "+a[2]+", "+a[3]+"]"}};w&&(w.glMatrixArrayType=o,w.MatrixArray=o,w.setMatrixArrayType=D,w.determineMatrixArrayType=G,w.glMath=E,w.vec2=J,w.vec3=r,w.vec4=K,w.mat2=I,w.mat3=A,w.mat4=x,w.quat4=k);return{glMatrixArrayType:o,MatrixArray:o,setMatrixArrayType:D,determineMatrixArrayType:G,glMath:E,vec2:J,vec3:r,vec4:K,mat2:I,mat3:A,mat4:x,quat4:k}});
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                   window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Function.bind polyfill:
//
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// Element.classList polyfill:
//
// https://github.com/remy/polyfills/blob/master/classList.js
//
// Copyright (c) 2010 Remy Sharp, http://remysharp.com
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {

if (typeof Element === "undefined" || Element.prototype.hasOwnProperty("classList")) return;

var indexOf = [].indexOf,
    slice = [].slice,
    push = [].push,
    splice = [].splice,
    join = [].join;

function DOMTokenList(el) {
  this._element = el;
  if (el.className != this.classCache) {
    this._classCache = el.className;

    var classes = this._classCache.split(' '),
        i;
    for (i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }
}

function setToClassName(el, classes) {
  el.className = classes.join(' ');
}

DOMTokenList.prototype = {
  add: function(token) {
    push.call(this, token);
    setToClassName(this._element, slice.call(this, 0));
  },
  contains: function(token) {
    return indexOf.call(this, token) !== -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    var i = indexOf.call(this, token);
    splice.call(this, i, 1);
    setToClassName(this._element, slice.call(this, 0));
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (indexOf.call(this, token) === -1) {
      this.add(token);
    } else {
      this.remove(token);
    }
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();

// Array.isArray polyfill from:
// https://gist.github.com/1126989
Array.isArray||(Array.isArray=function(a){return{}.toString.call(a)=='[object Array]';});// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
            + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
})();/**
 * A Blob is essentially a collection of eyes loosely tied together with a bunch of constraints.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {string} color The color of the blob.
 *     - {World} world The world that the blob should use for it's physics.
 */
var Blob = function(options){
    this.color_ = options.color;
    this.world_ = options.world;

    this.eyes_ = [];
    this.scleraPoints_ = [];
    this.eyeConstraints_ = [];
    for(var i = 0; i < Blob.MAX_EYES; i++)
        this.eyes_.push(this.createEye_());

    this.updateCurrentEmotion_();

    this.mouth_ = this.createMouth_();

    this.generateConstraints_();

    this.startGandering_();
};

Blob.prototype = {
    /**
     * The current emotion that the blob is feeling.
     *
     * @type {string}
     */
    currentEmotion: null,

    /**
     * The color of the blob.
     *
     * @type {string}
     * @private
     */
    color_: null,

    /**
     * The world this blob should be bound to.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The array of all the eyes in the blob.
     *
     * @type {Eye[]}
     * @private
     */
    eyes_: null,

    /**
     * The array of all the sclera points (to be used for hull calculation).
     *
     * @type {Point[]}
     * @private
     */
    scleraPoints_: null,

    /**
     * The array of all the eye-eye constraints.
     *
     * @type {Constraint[]}
     * @private
     */
    eyeConstraints_: null,

    /**
     * The blobs mouth.
     *
     * @type {Mouth}
     * @private
     */
    mouth_: null,

    /**
     * The member of the blob that is currently grabbed.
     *
     * @type {Mouth|Eye|null}
     * @private
     */
    grabbedMember_: null,

    /**
     * The previous mouse location.
     *
     * @type {Evt}
     * @private
     */
    previousMousePosition_: null,

    /**
     * Reference to the interval used for gandering.
     *
     * @type {number}
     * @private
     */
    ganderInterval_: null,

    /**
     * True if the blob is currently gandering. This is used for determining the blobs emotion.
     *
     * @type {boolean}
     * @private
     */
    gandering_: null,

    /**
     * Draws the blob with the given context.
     *
     * @param {CanvasRenderingContext2D} context The context into which the blob should draw.
     * @param {boolean} debugMode True if we should be rendering in debug mode.
     */
    draw: function(context, debugMode){
        this.updateCurrentEmotion_();

        var points = this.scleraPoints_.map(function(point){
            return this.world_.toPixelsVec(point.current);
        }, this);
        points.push(this.world_.toPixelsVec(this.mouth_.point.current));
        points = Utilities.computeHull(points, Blob.PADDING);

        if (debugMode){
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Blob.CURVATURE,
                fillStyle: 'rgba(205, 245, 255, 0.4)',
                strokeStyle: 'rgba(215, 245, 255, 0.8)',
                lineWidth: 5,

                debug: true,
                debugFillStyle: 'rgba(255, 255, 255, 0.7)',
                debugStrokeStyle: 'rgba(255, 255, 255, 0.5)',
                debugLineWidth: 1,
                knotRadius: 3,
                controlRadius: 2
            });
        } else {
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Blob.CURVATURE,
                fillStyle: this.color_
            });
        }

        var i, l;
        for(i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].draw(context, debugMode);

        if (debugMode){
            // Draw the constraints between the eyes.
            context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            context.lineWidth = 1;
            for(i = 0, l = this.eyeConstraints_.length; i < l; i++)
                this.eyeConstraints_[i].draw(context);
        }

        this.mouth_.draw(context, debugMode);
    },

    /**
     * Called by the experiment when the user presses their mouse down.
     *
     * @param {vec2} position The position at which the user pressed their mouse.
     */
    mouseDown: function(position){
        this.grabbedMember_ = this.getClosestMember_(position);

        if (this.grabbedMember_){
            this.previousMousePosition_ = position;
            this.mouseMove(position);

            document.body.classList.add('grabbed');
        }
    },

    /**
     * Called by the experiment when the user moves their mouse.
     *
     * @param {vec2} position The position of the users mouse.
     */
    mouseMove: function(position){
        this.lookAt_(position);

        this.ganderInterval_ = clearInterval(this.ganderInterval_);
        this.gandering_ = false;

        if (this.grabbedMember_){
            this.grabbedMember_.grab(position, this.previousMousePosition_);
            this.previousMousePosition_ = position;
        } else {
            this.startGandering_();
        }
    },

    /**
     * Called by the experiment when the user lifts up on their mouse.
     *
     * @param {vec2} position The position where the user lifted their mouse.
     */
    mouseUp: function(position){
        document.body.classList.remove('grabbed');

        if (this.grabbedMember_) this.grabbedMember_.release();
        this.grabbedMember_ = null;
    },

    createEye_: function(){
        var buffer = 0.3;
        var minDim =  Math.min(this.world_.width, this.world_.height);
        var dimWithBuffer = minDim * (1 - (buffer * 2));

        var x = (Math.random() * dimWithBuffer) + (minDim * buffer) +
            ((this.world_.width - minDim) / 2);
        var y = (Math.random() * dimWithBuffer) + (minDim * buffer) +
            ((this.world_.height - minDim) / 2);

        var scleraPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.SCLERA_RADIUS,
            mass: Eye.SCLERA_MASS,
            interactive: true,
            dampening: 0.03
        });

        this.scleraPoints_.push(scleraPoint);

        var pupilPoint = this.world_.addPoint({
            x: x,
            y: y,
            radius: Eye.PUPIL_RADIUS,
            mass: Eye.PUPIL_MASS,
            defaultForce: 0.003,
            dampening: 0.00001
        });

        this.world_.addConstraint({
            type: Constraint.FIXED,
            points: [
                scleraPoint,
                pupilPoint
            ],
            max: Eye.SCLERA_RADIUS - Eye.PUPIL_RADIUS - Eye.EDGE_SPACE
        });

        var eye = new Eye({
            pupilPoint: pupilPoint,
            scleraPoint: scleraPoint,
            world: this.world_
        });

        return eye;
    },

    createMouth_: function(){
        var point = this.world_.addPoint({
            x: 0.5 * this.world_.width,
            y: 0.5 * this.world_.height,
            radius: Mouth.RADIUS,
            mass: Mouth.MASS,
            interactive: true,
            dampening: 0.03
        });

        var mouth = new Mouth({
            point: point,
            world: this.world_,
            eyes: this.eyes_,
            blob: this
        });

        return mouth;
    },

    /**
     * Generate the set of constraints between all of the eyes and the mouth. This is done by
     * generating an adjacency matrix where each row is the distance from one eye to every other
     * eye in the simulation. Next we loop over each row and choose 4-6 of the closest eyes and add
     * a constraint between the two eyes. The mouth is just connected to every point in the blob
     * to help keep it in the center.
     */
    generateConstraints_: function(){
        var i, j, l;
        var matrix = new Array(Blob.MAX_EYES);

        for(i = 0; i < Blob.MAX_EYES; i++)
            matrix[i] = new Array(Blob.MAX_EYES);

        for(i = 0; i < Blob.MAX_EYES; i++){
            matrix[i][i] = Infinity;

            for (j = i + 1; j < Blob.MAX_EYES; j++){
                matrix[j][i] = matrix[i][j] = vec2.dist(this.eyes_[i].scleraPoint.current,
                    this.eyes_[j].scleraPoint.current);
            }
        }

        matrix.forEach(function(row, index1){
            if (index1 === Blob.MAX_EYES - 1) return;

            var connections = Math.floor(Math.random() * 2) + 4;
            var point1 = this.eyes_[index1].scleraPoint;
            var point2, constraint;

            while(connections > 0){
                connections--;

                var min = Math.min.apply(null, row);

                var index2 = row.indexOf(min);
                // Remove this value so we don't use it again.
                row[index2] = matrix[index2][index1] = Infinity;

                point2 = this.eyes_[index2].scleraPoint;

                constraint = this.world_.addConstraint({
                    type: Constraint.SPRING,
                    points: [
                        point1,
                        point2
                    ],
                    max: 3,
                    min: 2,
                    k: 0.1
                });

                this.eyeConstraints_.push(constraint);
            }
        }, this);

        // Connect the mouth to every other eye in the blob.
        for (i = 0, l = this.eyes_.length; i < l; i++){
            this.world_.addConstraint({
                type: Constraint.SPRING,
                points: [
                    this.mouth_.point,
                    this.eyes_[i].scleraPoint
                ],
                max: Mouth.RADIUS * 5,
                min: Mouth.RADIUS * 3,
                k: 0.05
            });
        }
    },

    /**
     * Sets all the eyes to look at the provided point.
     *
     * @param {vec2} point A point that the eyes should be looking towards.
     */
    lookAt_: function(point){
        this.lookingAt_ = point;

        for(var i = 0; i < Blob.MAX_EYES; i++)
            this.eyes_[i].lookAt(this.lookingAt_);
    },

    /**
     * Kicks off the gandering interval.
     */
    startGandering_: function(){
        this.ganderInterval_ = setInterval(this.gander_.bind(this), 3000);
    },

    /**
     * Set a flag that blob is gandering and look at a random point.
     */
    gander_: function(){
        this.gandering_ = true;
        this.lookAt_(this.world_.getRandomVec2());
    },

    /**
     * Returns the closest member to the provided point.
     *
     * @param {vec2} target The point to compare each member to.
     *
     * @return {Mouth|Eye}
     */
    getClosestMember_: function(target){
        var minDist = Infinity;
        var closestMember = null;
        var buffer = 0.5;

        var checkMember = function(member, point, radius){
            var dist = vec2.dist(target, point.current);
            if (dist < minDist && dist <= radius + buffer){
                minDist = dist;
                closestMember = member;
            }
        };

        this.eyes_.forEach(function(eye, index){
            checkMember(eye, eye.scleraPoint, Eye.SCLERA_RADIUS);
        });

        checkMember(this.mouth_, this.mouth_.point, Mouth.RADIUS);

        return closestMember;
    },

    updateCurrentEmotion_: function(){
        if (!this.currentEmotion){
            this.currentEmotion = Blob.EMOTIONS.HAPPY;
            return;
        }

        var dist = vec2.dist(this.mouth_.point.current, this.mouth_.point.previous);
        if (!this.mouth_.point.invMass){
            // Mouth is being grabbed.
            this.currentEmotion = Blob.EMOTIONS.GAGGED;
        } else if (dist > 0.03){
            // Moving too fast.
            this.currentEmotion_ = Blob.EMOTIONS.TERROR;
        } else if (!!this.grabbedMember_ || dist > 0.015){
            // Grabbed or moving a little.
            this.currentEmotion = Blob.EMOTIONS.SAD;
        } else if (!!this.gandering_){
            this.currentEmotion = Blob.EMOTIONS.BORED;
        } else if (this.inDanger_()){
            // In danger of being grabbed.
            this.currentEmotion = Blob.EMOTIONS.WORRIED;
        } else {
            this.currentEmotion = Blob.EMOTIONS.HAPPY;
        }
    },

    /**
     * Returns true if the users cursor is near the blob.
     *
     * @return {Boolean}
     */
    inDanger_: function(){
        if (!this.lookingAt_) return false;
        else return vec2.dist(this.mouth_.point.current, this.lookingAt_) < 3;
    }
};

/**
 * All of the emotions that the blob can feel.
 *
 * @type {object}
 * @static
 */
Blob.EMOTIONS = {
    HAPPY: 'HAPPY',
    SAD: 'SAD',
    TERROR: 'TERROR',
    WORRIED: 'WORRIED',
    GAGGED: 'GAGGED',
    BORED: 'BORED'
};

/**
 * The maximum number of eyes the blob should have.
 *
 * @type {Number}
 * @static
 */
Blob.MAX_EYES = 9;

/**
 * The amount of padding (in world units) between the outermost eyes and the edge of the blob.
 *
 * @type {Number}
 * @static
 */
Blob.PADDING = 1.5;

/**
 * The amount of curvature the blobs outer shell should have.
 *
 * @type {Number}
 * @static
 */
Blob.CURVATURE = 0.2;

/**
 * The maximum amount of gravity the blob can withstand.
 *
 * @type {Number}
 * @static
 */
Blob.MAX_GRAVITY = 0.01;
/**
 * A constraint represents a connection between any two points in the system. In can satisfy itself
 * using both spring physics or a simple maximum value.
 *
 * @param {Object} options An object literal with the following values:
 *     - {String} type The type of constraint this should be.
 *     - {Points[]} points The points this constraint should bind to.
 *     - {number} min The minimum distance to be maintained (only used by spring constraints).
 *     - {number} max The maximum distance allowed.
 *     - {number} k The spring constant to be used by spring constraints.
 */
var Constraint = function(options){
    this.type = options.type;

    this.points_ = options.points;
    this.world_ = options.world;

    this.min_ = options.min;
    this.max_ = options.max;

    if (this.type === Constraint.SPRING){
        this.k_ = options.k;

        var dist = vec2.dist(options.points[0].current, options.points[1].current);
        if (this.min_ !== undefined) dist = Math.max(dist, this.min_);
        if (this.max_ !== undefined) dist = Math.min(dist, this.max_);

        this.restLength_ = dist;

        this.satisfy = this.satisfySpring_;
    } else {
        this.satisfy = this.satisfyFixed_;
    }
};

Constraint.prototype = {
    /**
     * The type of constraint. Either SPRING or FIXED.
     *
     * @type {string}
     */
    type: null,

    /**
     * The spring constant to be used.
     *
     * @type {number}
     */
    k: null,

    /**
     * The minimum amount of distance that should be maintained (in world units).
     *
     * @type {number}
     * @private
     */
    min_: null,

    /**
     * The maximum amount of distance that should be maintained (in world units).
     *
     * @type {number}
     * @private
     */
    max_: null,

    /**
     * The default distance between the points.
     *
     * @type {number}
     * @private
     */
    restLength_: null,

    /**
     * The two points that this constraint controls.
     *
     * @type {Points[]}
     * @private
     */
    points_: null,

    /**
     * A reference to the world that this constraint belongs to.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * This function will be overwritten in initialize to be either satisfySpring_ or satisfyFixed_
     * depending on the initial parameters. In in responsible for moving the system ahead a step
     * in time.
     */
    satisfy: function(dt){},

    /**
     * Draw a simple representation of this constraint.
     *
     * @param {CanvasRenderingContext2D} context The context to be drawn into.
     */
    draw: function(context){
        var buffer = 0.05;

        var p1 = this.world_.toPixelsVec(this.points_[0].current);
        var r1 = this.world_.toPixelsValue(this.points_[0].radius + buffer);
        var p2 = this.world_.toPixelsVec(this.points_[1].current);
        var r2 = this.world_.toPixelsValue(this.points_[1].radius + buffer);

        var norm = vec2.normalize(vec2.subtract(p2, p1, vec2.create()));

        p1 = vec2.add(p1, vec2.scale(norm, r1, vec2.create()));
        p2 = vec2.subtract(p2, vec2.scale(norm, r2, vec2.create()));

        context.beginPath();
        context.moveTo(p1[0], p1[1]);
        context.lineTo(p2[0], p2[1]);
        context.stroke();
    },

    /**
     * Uses Hooke's law to satisfy the constraint.
     */
    satisfySpring_: function(dt){
        var between = vec2.create();
        vec2.subtract(this.points_[0].current, this.points_[1].current, between);

        var force = this.k_ * (this.restLength_ - vec2.length(between));

        var direction = vec2.normalize(between, vec2.create());
        this.points_[0].addForce(vec2.scale(direction, force / 2, vec2.create()));
        this.points_[1].addForce(vec2.scale(direction, -force / 2, vec2.create()));
    },

    /**
     * Simply moves one of the points when it exceeds its maximum distance.
     */
    satisfyFixed_: function(dt){
        // As a convention the first point of a fixed constraint will be considered immovable.
        var between = vec2.create();
        vec2.subtract(this.points_[1].current, this.points_[0].current, between);

        var distance = vec2.length(between);
        var direction = vec2.normalize(between, vec2.create());

        if (distance > this.max_){
            var adjustment = vec2.scale(direction, this.max_, vec2.create());
            vec2.add(this.points_[0].current, adjustment, this.points_[1].current);
        }
    }
};

/**
 * Constant used to define fixed length constraints.
 *
 * @type {String}
 */
Constraint.FIXED = 'fixed';

/**
 * Constant used to define spring constraints.
 *
 * @type {String}
 */
Constraint.SPRING = 'spring';/**
 * Sets up and supports the controls in the top left of the screen. This currently includes:
 *    - A debug toggle button.
 *    - A blob refresh button.
 *    - A gravity control.
 *
 * The gravity control button is the most intricate as it work with mouse up, down and drag events.
 * It also responds to clicks for enabling and disabling.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {Experiment} experiment The experiment that these controls are bound to.
 *     - {Element} debugEl The dom element for the debug toggle button.
 *     - {Element} resetEl The dom element for the reset button.
 *     - {Element} gravityEl The dom element for the gravity control button.
 *     - {boolean} touchEventsAvailable True if we should bind using touch events.
 *     - {boolean} orientationEventsAvailable True if we should bind on orientation events.
 */
var Controls = function(options){
    this.touchEventsAvailable_ = options.touchEventsAvailable;
    this.orientationEventsAvailable_ = options.orientationEventsAvailable;

    this.experiment_ = options.experiment;

    this.debugEl_ = options.debugEl;
    this.debugEl_.addEventListener(this.touchEventsAvailable_ ? 'touchend' : 'click',
        this.toggleRenderMode_.bind(this));

    this.resetEl_ = options.resetEl;
    this.resetEl_.addEventListener(this.touchEventsAvailable_ ? 'touchend' : 'click',
        this.resetButtonClicked_.bind(this));

    this.gravityEl_ = options.gravityEl;
    this.gravityArrow_ = this.gravityEl_.querySelector('i');
    this.updateGravitButtonDims_();

    this.prevGravityScale_ = 1;
    this.prevGravityDirection_ = vec2.createFrom(0, 1);
    this.currentGravity = vec2.create();

    if (this.orientationEventsAvailable_ || this.touchEventsAvailable_){
        window.addEventListener('deviceorientation', this.deviceOrientationEvt_.bind(this), false);
        this.gravityEl_.addEventListener('touchend', this.toggleGravity_.bind(this));
    } else {
        // Pre-bind the mouse move callback to ease adding and removing event listeners.
        this.gravityButtonMouseMove_ = this.gravityButtonMouseMove_.bind(this);
        this.gravityEl_.addEventListener('mousedown', this.gravityButtonMouseDown_.bind(this));
        document.body.addEventListener('mouseup', this.gravityButtonMouseUp_.bind(this));
    }
};

Controls.prototype = {
    /**
     * Whether or not the blob is rendering in debug mode.
     *
     * @type {Boolean}
     * @private
     */
    debugModeEnabled: null,

    /**
     * The current gravity the blob should be feeling.
     *
     * @type {vec2}
     */
    currentGravity: null,

    /**
     * A reference to the experiment that these controls belong to.
     *
     * @type {Experiment}
     * @private
     */
    experiment_: null,

    /**
     * The dom element for the debug toggle button.
     *
     * @type {Element}
     * @private
     */
    debugEl_: null,

    /**
     * The dom element for the reset button.
     *
     * @type {Element}
     * @private
     */
    resetEl_: null,

    /**
     * The dom element for the gravity control button.
     *
     * @type {Element}
     * @private
     */
    gravityEl_: null,

    /**
     * The dom element for the arrow button inside of the gravity control.
     *
     * @type {Element}
     * @private
     */
    gravityArrow_: null,

    /**
     * A timer id that is set when the user clicks the reset button.
     *
     * @type {number|null}
     */
    resetAnimationTimeout_: null,

    /**
     * The radius of the gravity button.
     *
     * @type {number}
     * @private
     */
    gravityButtonRadius_: null,

    /**
     * The center coordinates of the gravity button.
     *
     * @type {Vec2}
     * @private
     */
    buttonCenter_: null,

    /**
     * The position where the user started their mouse down action. This will be reset to null on
     * the next mouse up event.
     *
     * @type {Vec2|null}
     * @private
     */
    mouseStartPosition_: null,

    /**
     * True if the users device supports touch events.
     *
     * @type {boolean}
     * @private
     */
    touchEventsAvailable_: null,

    /**
     * True if the users device can emit orientation events.
     *
     * @type {boolean}
     * @private
     */
    orientationEventsAvailable_: null,

    /**
     * Called when the reset button is clicked.
     *
     * @param {MouseEvent} evt
     * @private
     */
    resetButtonClicked_: function(evt){
        evt.preventDefault();

        if (this.resetAnimationTimeout_) return;

        this.resetEl_.classList.add('animate');

        this.resetAnimationTimeout_ = setTimeout(function(){
            this.resetEl_.classList.remove('animate');

            this.resetAnimationTimeout_ = null;
        }.bind(this), 500);

        this.experiment_.reset();
    },

    /**
     * Toggle whether or not the blob should be rendering in debug mode.
     *
     * @private
     */
    toggleRenderMode_: function(){
        this.debugModeEnabled = !this.debugModeEnabled;

        if (this.debugModeEnabled){
            document.body.classList.add('debug-mode');
        } else {
            document.body.classList.remove('debug-mode');
        }
    },

    /**
     * Updates the cached dimensions and location of the gravity control button.
     *
     * @private
     */
    updateGravitButtonDims_: function(){
        this.gravityButtonRadius_ = this.gravityEl_.clientWidth / 2;
        this.buttonCenter_ = vec2.createFrom(this.gravityEl_.offsetLeft + this.gravityButtonRadius_,
            this.gravityEl_.offsetTop + this.gravityButtonRadius_);
    },

    /**
     * Called when the user presses their mouse down on the gravity control.
     *
     * @param {MouseEvent} evt
     * @private
     */
    gravityButtonMouseDown_: function(evt){
        evt.preventDefault();

        this.updateGravitButtonDims_();

        // Store the start position so we know if the user has clicked later.
        this.mouseStartPosition_ = Utilities.eventToVec2(evt);

        document.body.addEventListener('mousemove', this.gravityButtonMouseMove_);
    },

    /**
     * Called when ever the user has already pressed down on the gravity button and is now moving
     * their mouse, this method will update the direction and strength of the gravity
     *
     * @param {MouseEvent} evt
     * @private
     */
    gravityButtonMouseMove_: function(evt){
        evt.preventDefault();

        var direction = vec2.subtract(this.buttonCenter_, Utilities.eventToVec2(evt));
        vec2.scale(direction, -1);

        var length = vec2.length(direction);
        var magnitude = (length < this.gravityButtonRadius_) ?
            length / this.gravityButtonRadius_ : 1;

        this.updateGravity_(direction, Math.max(magnitude, 0.3));
    },

    /**
     * Called when ever the user releases their mouse down. This method will check if the user
     * clicked or if they performed a drag.
     *
     * @param {MouseEvent} evt
     * @private
     */
    gravityButtonMouseUp_: function(evt){
        if (!this.mouseStartPosition_) return;

        evt.preventDefault();

        // If the user dragged less that 5px, just assume this was a click.
        if (vec2.dist(Utilities.eventToVec2(evt), this.mouseStartPosition_) < 5){
            this.toggleGravity_();
        }

        this.mouseStartPosition_ = null;

        document.body.removeEventListener('mousemove', this.gravityButtonMouseMove_);
    },

    /**
     * Called only when the users device orientation changes.
     */
    deviceOrientationEvt_: function(evt){
        var direction = vec2.createFrom(evt.gamma, evt.beta);

        if (window.orientation){
            mat2.multiplyVec2(mat2.rotate(mat2.identity(), -window.orientation), direction);
        }

        this.prevGravityDirection_ = direction;
        this.prevGravityScale_ = 1;

        if (vec2.length(this.currentGravity)){
            this.updateGravity_(this.prevGravityDirection_, this.prevGravityScale_);
        } else {
            this.updateGravityControl_(direction, 1);
        }
    },

    /**
     * Toggles gravity on or off.
     */
    toggleGravity_: function(){
        if (vec2.length(this.currentGravity)){
            // If the world currently has gravity, disable it.
            this.updateGravity_(vec2.createFrom(0, 0), 0);
        } else {
            // If the world previously did not have gravity, restore the previous values.
            this.updateGravity_(this.prevGravityDirection_, this.prevGravityScale_);
        }
    },

    /**
     * Updates the current gravity given a direction and a magnitude.
     * @param {vec2} direction The direction gravity should be pointing.
     * @param {number} magnitude The magnitude of the gravity [0-1];
     */
    updateGravity_: function(direction, magnitude){
        if (magnitude !== 0){
            // Save this state and update the button.
            this.prevGravityScale_ = magnitude;
            this.prevGravityDirection_ = direction;

            this.updateGravityControl_(direction, magnitude);

            document.body.classList.add('gravity-enabled');
        } else {
            document.body.classList.remove('gravity-enabled');
        }

        this.currentGravity = vec2.scale(vec2.normalize(direction),
            Blob.MAX_GRAVITY * magnitude);
    },

    /**
     * Updates the actual gravity control to point in a given direction.
     * @param {vec2} direction The direction that the arrow should point.
     * @param {number} magnitude The magnitude of the gravity.
     */
    updateGravityControl_: function(direction, magnitude){
        var angle = Math.atan2(direction[1], direction[0]);
        [
            'webkitTransform',
            'mozTransform',
            'msTransform',
            'oTransform',
            'transform'
        ].forEach(function(property){
            this.gravityArrow_.style[property] = 'rotate(' + angle.toFixed(2) +
                'rad) ' + 'scale(' + magnitude + ')';
        }, this);
    }
};/**
 * The main controller class for the entire experiment. When instantiated it will create a new blob
 * and world for it to live in. It will also kick off the rendering loop.
 */
var Experiment = function(){
    this.canvas_ = document.querySelector('canvas');
    this.context_ = this.canvas_.getContext('2d');
    this.canvas_.height = window.innerHeight;
    this.canvas_.width = window.innerWidth;

    this.touchEventsAvailable_ = ('ontouchstart' in document.documentElement);

    this.orientationEventsAvailable_ = !!window.DeviceMotionEvent;

    this.controls_ = new Controls({
        touchEventsAvailable: this.touchEventsAvailable_,
        orientationEventsAvailable: this.orientationEventsAvailable_,
        gravityEl: document.querySelector('.control.gravity'),
        debugEl: document.querySelector('.control.debug'),
        resetEl: document.querySelector('.control.reset'),
        experiment: this
    });

    this.favIcon_ = new FavIcon();

    this.initializeEvents_();
    this.reset();

    // Binding early so we don't have to on every animation step.
    this.animate_ = this.animate_.bind(this);

    this.animate_();
};

Experiment.prototype = {
    /**
     * The canvas that everything will render into.
     *
     * @type {CanvasElement}
     * @private
     */
    canvas_: null,

    /**
     * The canvas context that everything should be drawn onto.
     *
     * @type {CanvasRenderingContext2D}
     * @private
     */
    context_: null,

    /**
     * A reference to the controls for this experiment.
     *
     * @type {Controls}
     * @private
     */
    controls_: null,

    /**
     * The world that should be used.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The actively rendering blob.
     *
     * @type {Blob}
     * @private
     */
    blob_: null,

    /**
     * The color to be used on the next blob.
     *
     * @type {string}
     * @private
     */
    nextColor_: null,

    /**
     * The color of the current blob.
     *
     * @type {string}
     * @private
     */
    currentColor_: null,

    /**
     * A reference to a FavIcon instance.
     * @type {FavIcon}
     */
    favIcon_: null,

    /**
     * True if the users device supports touch events.
     *
     * @type {boolean}
     * @private
     */
    touchEventsAvailable_: null,

    /**
     * True if the users device can emit orientation events.
     *
     * @type {boolean}
     * @private
     */
    orientationEventsAvailable_: null,

    /**
     * Instantiates a new blob and world.
     *
     * @private
     */
    reset: function(){
        if (this.nextColor_) document.body.classList.remove(this.nextColor_);

        this.currentColor_ = this.nextColor_ || this.randomColor_();
        this.nextColor_ = this.randomColor_();

        var color = this.randomColor_();

        this.currentGravity_ = vec2.create();

        this.world_ = new World({
            gravity: this.controls_.currentGravity,
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.blob_ = new Blob({
            world: this.world_,
            color: this.currentColor_
        });

        document.body.classList.add(this.nextColor_);
    },

    /**
     * Step the whole experiments ahead on frame and kick off the next animation request.
     *
     * @private
     */
    animate_: function(){
        this.context_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);

        this.world_.gravity = this.controls_.currentGravity;
        this.world_.step();

        this.blob_.draw(this.context_, this.controls_.debugModeEnabled);

        requestAnimationFrame(this.animate_, this.canvas_);
    },

    /**
     * Initialize event listeners for window resizing and mouse events.
     *
     * @private
     */
    initializeEvents_: function(){
        window.addEventListener('resize', this.resize_.bind(this));

        if (this.touchEventsAvailable_){
            document.addEventListener('touchstart', this.mouseDown_.bind(this));
            document.addEventListener('touchmove', this.mouseMove_.bind(this));
            document.addEventListener('touchend', this.mouseUp_.bind(this));
            document.addEventListener('touchcancel', this.mouseOut_.bind(this));
        } else {
            document.body.addEventListener('mousedown', this.mouseDown_.bind(this));
            document.body.addEventListener('mousemove', this.mouseMove_.bind(this));
            document.body.addEventListener('mouseup', this.mouseUp_.bind(this));
            document.body.addEventListener('mouseout', this.mouseOut_.bind(this));
        }
    },

    /**
     * Called when the window is resized.
     *
     * @private
     */
    resize_: function(){
        this.world_.setSize(window.innerWidth, window.innerHeight);

        this.canvas_.height = window.innerHeight;
        this.canvas_.width = window.innerWidth;
    },

    /**
     * Called when the user presses down on their mouse.
     *
     * @private
     */
    mouseDown_: function(evt){
        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseDown(this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user moves their mouse.
     *
     * @private
     */
    mouseMove_: function(evt){
        evt.preventDefault();

        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseMove(this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user lifts up on their mouse.
     *
     * @private
     */
    mouseUp_: function(evt){
        evt.preventDefault();

        if (evt.touches) evt = evt.touches[0];

        this.blob_.mouseUp(evt && this.eventToWorldVec2_(evt));
    },

    /**
     * Called when the user mouses out of the experiment. This is only really needed when the user
     * has already pressed down and is dragging.
     *
     * @param {MouseEvent} evt
     * @private
     */
    mouseOut_: function(evt){
        this.mouseUp_(evt);
    },

    /**
     * Converts a JavaScript mouse event into a vector in world coordinates.
     *
     * @param {MouseEvent} evt
     *
     * @return {vec2}
     * @private
     */
    eventToWorldVec2_: function(evt){
        var scale = [this.world_.width / window.innerWidth,
            this.world_.height / window.innerHeight];

        return vec2.multiply(scale, Utilities.eventToVec2(evt));
    },

    /**
     * Returns a random CSS color.
     *
     * @return {string}
     * @private
     */
    randomColor_: function(){
        var colors = [
            'lightblue',
            'lightcoral',
            'lightgreen',
            'lightpink',
            'lightsalmon',
            'lightseagreen',
            'lightskyblue',
            'palevioletred',
            'yellowgreen',
            'peru'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

document.addEventListener('DOMContentLoaded', function(){
    window.exp = new Experiment();
});
var Eye = function(options){
    this.scleraPoint = options.scleraPoint;
    this.pupilPoint = options.pupilPoint;
    this.world_ = options.world;
    this.scleraRadius_ = options.scleraRadius || Eye.SCLERA_RADIUS;
    this.pupilRadius_ = options.pupilRadius || Eye.PUPIL_RADIUS;
};

Eye.prototype = {
    draw: function(context, debug){
        if (this.scleraPoint.invMass === 0){
            // If the eye is currently grabbed make it look at some random point.
            this.lookAt(this.world_.getRandomVec2());
        }

        this.drawSclera_(context, debug);
        this.drawPupil_(context, debug);
    },

    lookAt: function(point){
        var direction = vec2.subtract(point, this.scleraPoint.current, vec2.create());
        this.pupilPoint.defaultForceDirection = vec2.normalize(direction);
    },

    grab: function(current, previous){
        this.scleraPoint.invMass = 0;
        this.scleraPoint.current = current;
        this.scleraPoint.previous = previous;
    },

    release: function(){
        this.scleraPoint.invMass = 1 / this.scleraPoint.mass;
    },

    drawSclera_: function(context, debug){
        var p = this.world_.toPixelsVec(this.scleraPoint.current);
        var radius = this.world_.toPixelsValue(this.scleraRadius_);

        context.beginPath();
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);

        if (debug){
            context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            context.fillStyle = 'rgba(255, 255, 255, 0.4)';
            context.lineWidth = 1;
            context.stroke();
            context.fill();
        } else {
            context.fillStyle = 'white';
            context.fill();
        }
    },

    drawPupil_: function(context, debug){
        var p = this.world_.toPixelsVec(this.pupilPoint.current);
        var radius = this.world_.toPixelsValue(this.pupilRadius_);

        context.beginPath();
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, Math.PI * 2, false);

        if (debug){
            context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            context.fillStyle = 'rgba(255, 255, 255, 0.7)';
            context.lineWidth = 1;
            context.stroke();
            context.fill();
        } else {
            context.fillStyle = 'rgba(0,0,0,0.75)';
            context.fill();
        }
    }
};

Eye.SCLERA_MASS = 0.01;
Eye.SCLERA_RADIUS = 0.246;

Eye.PUPIL_MASS = 0.005;
Eye.PUPIL_RADIUS = 0.1;

Eye.EDGE_SPACE = 0.03;

/**
 * An instance of FavIcon is responsible for rendering an eyeball into the favicon of the page.
 */
var FavIcon = function(){
    this.link_ = document.getElementById('favicon');
    this.canvas_ = document.createElement('canvas');
    this.context_ = this.canvas_.getContext('2d');
    this.canvas_.width = this.canvas_.height = FavIcon.SIZE;

    this.world_ = new World({
        gravity: vec2.create(),
        width: FavIcon.SIZE,
        height: FavIcon.SIZE
    });

    this.eye_ = this.createEye();

    setInterval(this.animate_.bind(this), 10);
    setInterval(this.gander_.bind(this), 3000);
};

FavIcon.prototype = {
    /**
     * A reference to the favicon link tag in the head of the document.
     * @type {Element}
     */
    link_: null,

    /**
     * A reference to the canvas that the eye will be rendered onto.
     * @type {Element}
     */
    canvas_: null,

    /**
     * The context that the eye should be rendered onto.
     * @type {CanvasRenderingContext2D}
     */
    context_: null,

    /**
     * A reference to the eye of the FavIcon.
     * @type {Eye}
     */
    eye_: null,

    /**
     * Steps the world, draws the eye and updates the link tag in the head.
     */
    animate_: function(){
        this.context_.clearRect(0, 0, FavIcon.SIZE, FavIcon.SIZE);

        this.world_.step();

        this.eye_.draw(this.context_);

        this.link_.href = this.canvas_.toDataURL('image/png');
    },

    gander_: function(){
        this.eye_.lookAt(this.world_.getRandomVec2());
    },

    createEye: function(){
        var worldSize = this.world_.width;
        var scleraRadius = worldSize / 2;
        var pupilRadius = worldSize * 0.2;

        var scleraPoint = this.world_.addPoint({
            x: scleraRadius,
            y: scleraRadius,
            radius: scleraRadius,
            mass: Eye.SCLERA_MASS,
            dampening: 0.03
        });

        var pupilPoint = this.world_.addPoint({
            x: scleraRadius,
            y: scleraRadius,
            radius: pupilRadius,
            mass: Eye.PUPIL_MASS,
            defaultForce: 0.008,
            dampening: 0.1
        });

        this.world_.addConstraint({
            type: Constraint.FIXED,
            points: [
                scleraPoint,
                pupilPoint
            ],
            max: scleraRadius - pupilRadius - 0.3
        });

        var eye = new Eye({
            pupilPoint: pupilPoint,
            scleraPoint: scleraPoint,
            world: this.world_,
            scleraRadius: scleraRadius,
            pupilRadius: pupilRadius
        });

        return eye;
    }
};

FavIcon.SIZE = 16;/**
 * A Mouth is used to represent the mouth of a blob and all its emotions.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {Point} point The point this mouth should be attached to.
 *     - {World} world The world this mouth belongs to.
 *     - {Blob} blob The blob this mouth resides in.
 */
var Mouth = function(options){
    this.point = options.point;
    this.world_ = options.world;
    this.blob_ = options.blob;

    this.currentExpression_ = Mouth.EMOTION_PATHS[this.blob_.currentEmotion].map(function(point){
        return point.slice(0);
    });
};

Mouth.prototype = {
    /**
     * The center point of the mouth.
     *
     * @type {vec2}
     */
    point: null,

    /**
     * The current current expression of the mouth as array of 2d points.
     *
     * @type {vec2[]}
     * @private
     */
    currentExpression_: null,

    /**
     * The world that this mouth live in.
     *
     * @type {World}
     * @private
     */
    world_: null,

    /**
     * The blob that this mouth belongs to.
     *
     * @type {Blob}
     * @private
     */
    blob_: null,

    draw: function(context, xRayMode){
        var point = this.world_.toPixelsVec(this.point.current);
        var radius = this.world_.toPixelsValue(Mouth.RADIUS);

        context.save();
        context.translate(point[0] - radius, point[1] - radius);

        this.updateExpression_();

        var points = this.currentExpression_.map(function(point){
            return [point[0] * radius * 2, point[1] * radius * 2];
        });

        if (xRayMode){
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Mouth.CURVATURE,
                fillStyle: 'rgba(255, 255, 255, 0.2)',
                strokeStyle: 'rgba(255, 255, 255, 0.4)',
                lineWidth: 2,

                debug: true,
                debugFillStyle: 'rgba(255, 255, 255, 0.6)',
                debugStrokeStyle: 'rgba(255, 255, 255, 0.5)',
                debugLineWidth: 1,
                knotRadius: 2,
                controlRadius: 1
            });
        } else {
            Utilities.drawSpline({
                context: context,
                points: points,
                curvature: Mouth.CURVATURE,
                fillStyle: 'rgba(0, 0, 0, 0.85)'
            });
        }

        context.restore();
    },

    grab: function(current, previous){
        this.point.invMass = 0;
        this.point.current = current;
        this.point.previous = previous;
    },

    release: function(){
        this.point.invMass = 1 / this.point.mass;
    },

    /**
     * Lerp the the current expression towards the emotion the mouth should be displaying.
     */
    updateExpression_: function(){
        var currentPoint, targetPoint, sign;
        for (var i = 0, l = this.currentExpression_.length; i < l; i++){
            currentPoint = this.currentExpression_[i];
            targetPoint = Mouth.EMOTION_PATHS[this.blob_.currentEmotion][i];

            // Lerp vertically.
            if (Math.abs(currentPoint[1] - targetPoint[1]) > Mouth.LERP){
                sign = this.determineSign_(targetPoint[1] - currentPoint[1]);
                currentPoint[1] += (sign * Mouth.LERP);
            }

            // Lerp horizontally.
            if (Math.abs(currentPoint[0] - targetPoint[0]) > Mouth.LERP){
                sign = this.determineSign_(targetPoint[0] - currentPoint[0]);
                currentPoint[0] += (sign * Mouth.LERP);
            }
        }
    },

    /**
     * Quick helper function to determine the sign of a number.
     *
     * @param {Number} num
     *
     * @return {Number} The sign of the provided number.
     */
    determineSign_: function(num){
        return num > 0 ? 1 : num === 0 ? 0 : -1;
    }
};

/**
 * A map of emotions to paths.
 *
 * @type {Object}
 * @static
 */
Mouth.EMOTION_PATHS = {
    HAPPY: [[0, 0.5], [0.5, 0.3], [1, 0.5], [0.5, 1]],
    SAD: [[0, 0.7], [0.5, 0.3], [1, 0.7], [0.5, 0.5]],
    TERROR: [[0.1, 0.5], [0.5, 0.1], [0.9, 0.5], [0.5, 0.9]],
    WORRIED: [[0, 0.6], [0.5, 0.3], [1, 0.6], [0.5, 0.7]],
    GAGGED: [[0.3, 0.55], [0.5, 0.45], [0.7, 0.55], [0.5, 0.6]],
    BORED: [[0, 0.5], [0.5, 0.4], [1, 0.5], [0.5, 0.7]]
};

/**
 * The size of the step to use when tweening emotions.
 *
 * @type {Number}
 * @static
 */
Mouth.LERP = 0.025;

/**
 * The amount of curve to be applied over the emotion paths above.
 *
 * @type {Number}
 * @static
 */
Mouth.CURVATURE = 0.6;

/**
 * The size of half the mouth.
 *
 * @type {Number}
 * @static
 */
Mouth.RADIUS = 0.45;

/**
 * The weight of the mouth.
 *
 * @type {Number}
 * @static
 */
Mouth.MASS = 0.005;/**
 * A point represents an individual point mass in a system.
 *
 * @param {Object} options An object literal with the following properties:
 *     - {number} x The starting x position of the point.
 *     - {number} y The starting y position of the point.
 *     - {number} mass
 *     - {number} radius
 *     - {boolean} interactive
 *     - {number} defaultForce The amount of force that should be applied by default.
 */
var Point = function(options){
    this.current = vec2.createFrom(options.x, options.y);
    this.previous = vec2.createFrom(options.x, options.y);

    this.radius = options.radius;

    this.mass = options.mass;
    this.invMass = 1 / options.mass;

    this.interactive = options.interactive;
    this.defaultForce = options.defaultForce;
    this.defaultForceDirection = vec2.createFrom(0, 1);

    this.force_ = vec2.createFrom(0.0, 0.0);
    this.dampening_ = options.dampening;

    this.world_ = options.world;
};

Point.prototype = {
    /**
     * The current position of the point.
     *
     * @type {vec2}
     */
    current: null,

    /**
     * The previous position of the point.
     *
     * @type {vec2}
     */
    previous: null,

    /**
     * The radius of the point in world units.
     *
     * @type {number}
     */
    radius: null,

    /**
     * The mass of the unit in kg.
     *
     * @type {number}
     */
    mass: null,

    /**
     * The inverse of the mass of the point.
     *
     * @type {number}
     */
    invMass: null,

    /**
     * Whether this point should interact with gravity and other points in the system.
     *
     * @type {boolean}
     */
    interactive: null,

    /**
     * The default force to be applied to this particle at every step.
     *
     * @type {number}
     */
    defaultForce: null,

    /**
     * The direction that the default force should be applied over.
     *
     * @type {vec2}
     */
    defaultForceDirection: null,

    /**
     * The accumulated force that should be applied to this point.
     *
     * @type {vec2}
     * @private
     */
    force_: null,

    /**
     * The amount of dampening to be applied to this point when it moves.
     *
     * @type {number}
     */
    dampening_: null,

    /**
     * A reference to the world that this particle belongs to.
     *
     * @type {World}
     */
    world_: null,

    /**
     * Adds a force vector to the force accumulator.
     *
     * @param {vec2} force The new force to be applied.
     */
    addForce: function(force){
        vec2.add(force, this.force_);
    },

    /**
     * Move a point ahead a given time step.
     *
     * @param {number} dt Amount of time to move ahead (in ms).
     */
    move: function(dt){
        // If the point has infinite mass we don't need to move at all.
        if (this.invMass === 0){
            this.force_ = vec2.create();
            return;
        }

        if (this.interactive) this.addForce(this.world_.gravity);
        if (this.defaultForce) this.addForce(vec2.scale(this.defaultForceDirection,
            this.defaultForce, vec2.create()));

        var temp = vec2.create(this.current);

        // Find the difference vector between current and previous.
        var delta = vec2.subtract(this.current, this.previous, vec2.create());

        // Find the amount of force to be applied for this time step.
        var force = vec2.scale(this.force_, 1 / (this.mass * dt * dt), vec2.create());

        // Calculate the amount of change to apply to the current position.
        var change = vec2.scale(vec2.add(delta, force, vec2.create()), 1 - this.dampening_);

        vec2.add(change, this.current);
        this.previous = temp;

        // Interact with the rest of the system.
        if (this.interactive) this.world_.interact(this);

        // Reset the forces.
        this.force_ = vec2.create();
    }
};
var Utilities = {
    /**
     * Converts a mouse event into a vec2.
     *
     * @param {MouseEvent} evt
     *
     * @return {vec2}
     */
    eventToVec2: function(evt){
        return vec2.createFrom(evt.pageX, evt.pageY);
    },

    /**
     * Given a set of points compute which ones form a convex hull. If a padding is provided then
     * expand the hull by that amount.
     *
     * @param {vec2[]} points
     * @param {number} padding Value between 0 and 1.
     *
     * @return {vec2[]}
     */
    computeHull: function(points, padding){
        var i, l;

        // Compute the cross product between OA and OB.
        function cross(o, a, b){
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        }

        // Sort the points horizontally then vertically.
        points.sort(function(p1, p2){
            return (p1[0] - p2[0]) || (p1[1] - p2[1]);
        });

        var center = vec2.create();
        var lower = [];
        var upper = [];

        for (i = 0, l = points.length; i < l; i++){
            // Compute the lower hull.
            while (lower.length >= 2 &&
                cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0){
                lower.pop();
            }
            lower.push(points[i]);

            // Compute the upper hull.
            while (upper.length >= 2 &&
                cross(upper[upper.length - 2], upper[upper.length - 1], points[l - i - 1]) <= 0){
                upper.pop();
            }
            upper.push(points[l - i - 1]);

            // Add this point to the center vector.
            vec2.add(points[i], center);
        }

        // Scale the center vector by number of points to find the actual center.
        vec2.scale(center, 1 / points.length);

        // Remove the duplicate points.
        upper.pop();
        lower.pop();

        // Expand the hull outward.
        var hull = lower.concat(upper);

        if (!padding) return hull;

        var scale = padding;
        var offset = vec2.subtract(vec2.scale(center, scale, vec2.create()), center);
        var expandedHull = [];
        for (i = 0, l = hull.length; i < l; i++){
            // Scale the hull point then subtract the center offset so that at the end the expanded
            // hull encloses the original hull.
            expandedHull.push(vec2.subtract(vec2.scale(hull[i], scale, vec2.create()), offset,
                vec2.create()));
        }

        return expandedHull;
    },

    /**
     * Draws a spline around the passed in points.
     *
     * @param {Object} options An object literal with the following values:
     *     - {CanvasRenderingContext2D} context The context in which the spline should be drawn.
     *     - {vec2[]} points Array of points to be connected by a spline.
     *     - {number} curvature The curvature factor to be used when calculating the controls.
     *     - {string} fillStyle The style to be applied to the area created by the spline.
     *     - {string} strokeStyle The style to be applied to the curve lines.
     *     - {number} lineWidth The width of the line of the spline in pixels.
     *     - {boolean} debug True if the debug lines should be drawn,
     *     - {string} debugFillStyle The style to be applied to debug areas (controls).
     *     - {string} debugStrokeStyle The style to be applied to debug lines.
     *     - {number} debugLineWidth The width of of the control lines in pixels.
     *     - {number} knotRadius The radius for each knot point in pixels.
     *     - {number} controlRadius The radius for each control point in pixels.
     */
    drawSpline: function(options){
        var context = options.context;
        var curves = this.getCurves_(options.points, options.curvature);

        this.drawPath_(context, curves);

        if (options.fillStyle){
            context.fillStyle = options.fillStyle;
            context.fill();
        }

        if (options.strokeStyle){
            context.strokeStyle = options.strokeStyle;
            context.lineWidth = options.lineWidth;
            context.stroke();
        }

        if (options.debug) this.drawDebug_(options, curves);
    },

    /**
     * Draws all the knots and control points of the spline as well as a line from the control
     * points to their respective knots.
     */
    drawDebug_: function(options, curves){
        var context = options.context;

        context.fillStyle = options.debugFillStyle;
        context.strokeStyle = options.debugStrokeStyle;
        context.lineWidth = options.debugLineWidth;

        var i, l, curve, knot;
        for (i = 0, l = curves.length; i < l; i++){
            curve = curves[i];

            // Draw the start knot for this curve.
            context.fillRect(curve.start[0] - options.knotRadius,
                curve.start[1] - options.knotRadius,
                options.knotRadius * 2, options.knotRadius * 2);

            // Draw the control points.
            context.fillRect(curve.controls[0][0] - options.controlRadius,
                curve.controls[0][1] - options.controlRadius,
                options.controlRadius * 2, options.controlRadius * 2);

            context.fillRect(curve.controls[1][0] - options.controlRadius,
                curve.controls[1][1] - options.controlRadius,
                options.controlRadius * 2, options.controlRadius * 2);

            // Draw a line from the knots to their control points.
            context.beginPath();
            context.moveTo(curve.start[0], curve.start[1]);
            context.lineTo(curve.controls[0][0], curve.controls[0][1]);
            context.stroke();

            context.beginPath();
            context.moveTo(curve.end[0], curve.end[1]);
            context.lineTo(curve.controls[1][0], curve.controls[1][1]);
            context.stroke();
        }
    },

    /**
     * Given a context and a set of curves (knots and controls) actually draw bezier curves to the
     * canvas context.
     */
    drawPath_: function(context, curves){
        var i, l;

        context.beginPath();
        context.moveTo(curves[0].start[0], curves[0].start[1]);
        for (i = 0, l = curves.length; i < l; i++){
            context.bezierCurveTo(curves[i].controls[0][0], curves[i].controls[0][1],
                curves[i].controls[1][0], curves[i].controls[1][1],
                curves[i].end[0], curves[i].end[1]);
        }
    },

    getCurves_: function(points, curvature){
        var i, l;
        var controlPoints = this.getAllControlPoints_(points, curvature);
        var curves = [];

        curves.push({
            start: points[0],
            end: points[1],
            controls: [controlPoints[controlPoints.length - 1], controlPoints[0]]
        });

        var counter = 1;
        for (i = 1, l = points.length - 1; i < l; i++){
            curves.push({
                start: points[i],
                end: points[i + 1],
                controls: [controlPoints[counter++], controlPoints[counter++]]
            });
        }

        curves.push({
            start: points[i],
            end: points[0],
            controls: [controlPoints[counter++], controlPoints[counter++]]
        });

        return curves;
    },

    getAllControlPoints_: function(points, curvature){
        var i, l;
        var controlPoints = [];

        var count = 0;
        for (i = 0, l = points.length - 2; i < l; i++){
            controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i], points[i + 1], points[i + 2], curvature));
        }

        controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i], points[i + 1], points[0], curvature));
        controlPoints.push.apply(controlPoints, this.getControlPoints_(points[i + 1], points[0], points[1], curvature));

        return controlPoints;
    },

    getControlPoints_: function(p0, p1, p2, t){
        var d01 = vec2.dist(p0, p1);
        var d12 = vec2.dist(p1, p2);

        var fa = t * d01 / (d01 + d12);
        var fb = t - fa;

        var c1 = vec2.subtract(p0, p2, vec2.create());
        vec2.scale(c1, fa);
        vec2.add(p1, c1);
        c1.knot = p1;

        var c2 = vec2.subtract(p0, p2, vec2.create());
        vec2.scale(c2, fa);
        vec2.subtract(p1, c2);
        c2.knot = p1;

        return [c1, c2];
    }
};
/**
 * A world is responsible for keeping track of all points and constraints in a system. It is also
 * in charge of moving the system ahead at every step.
 *
 * @param {Object} options An object literal with the following properties.
 *     - {vec2} gravity A vector to be used as the force of gravity on every point.
 */
var World = function(options){
    this.gravity = options.gravity;

    this.constraints_ = [];

    this.interactivePoints_ = [];
    this.nonInteractivePoints_ = [];

    this.setSize(options.width, options.height);
};

World.prototype = {
    /**
     * The width of the system in meters.
     *
     * @type {number}
     */
    width: null,

    /**
     * The height of the system in meters.
     *
     * @type {number}
     */
    height: null,

    /**
     * The gravity vector that should be applied to all interactive points.
     *
     * @type {vec2}
     */
    gravity: null,

    /**
     * An array that contains all of the points in the system that interact with everything.
     *
     * @type {Point[]}
     * @private
     */
    interactivePoints_: null,

    /**
     * An array that contains all of the points in the system that do not interact with anything.
     *
     * @type {Point[]}
     * @private
     */
    nonInteractivePoints_: null,

    /**
     * An array that contains all of the constraints in the system.
     *
     * @type {Constraint[]}
     * @private
     */
    constraints_: null,

    /**
     * A vector that can be used to scale from world coordinates back to pixels.
     *
     * @type {vec2}
     * @private
     */
    scale_: null,

    /**
     * The scale factor of the largest edge from world coordinates back to pixels.
     *
     * @type {number}
     * @private
     */
    maxScale_: null,

    /**
     * Sets the size of the system to the provided width and height.
     *
     * @param {number} width The new width of the world.
     * @param {number} height The new height of the world.
     */
    setSize: function(width, height){
        var innerWidth = width;
        var innerHeight = height;

        if (innerWidth > innerHeight){
            this.width = World.MIN_DIMENSION * (innerWidth / innerHeight);
            this.height = World.MIN_DIMENSION;

            this.maxScale_ = innerWidth / this.width;
        } else {
            this.width = World.MIN_DIMENSION;
            this.height = World.MIN_DIMENSION * (innerHeight / innerWidth);

            this.maxScale_ = innerHeight / this.height;
        }

        this.scale_ = vec2.createFrom(innerWidth / this.width, innerHeight / this.height);
    },

    /**
     * Adds a point to the system.
     *
     * @param {object} options An object literal to be passed to the Point constructor. See the
     *     Point class for details.
     */
    addPoint: function(options){
        options.world = this;
        var point = new Point(options);

        if (options.interactive) this.interactivePoints_.push(point);
        else this.nonInteractivePoints_.push(point);

        return point;
    },

    /**
     * Adds a constraint to the system.
     *
     * @param {object} options An object literal to be passed to the Constraint constructor. See the
     *     Constraint class for details.
     */
    addConstraint: function(options){
        options.world = this;
        var constraint = new Constraint(options);
        this.constraints_.push(constraint);
        return constraint;
    },

    /**
     * Adjusts the provided point to account for collisions with the edges of the system as well as
     * collisions with other points. This method will be called by each interactive point when it
     * updates during it's move phase.
     *
     * @param {Point} point The point that should interact with its surroundings.
     */
    interact: function(point){
        var i, l, point2;

        for (i = 0, l = this.interactivePoints_.length; i < l; i++){
            point2 = this.interactivePoints_[i];
            if (point !== point2) this.collidePoints_(point, point2);
        }

        // Collide with the edges of the system.
        var current = point.current;
        var r = point.radius;
        var x = current[0];
        var y = current[1];

        // If either of the height or width are outside of the bounds, just move it back in.
        current[0] = (x < r) ? r : (x > this.width - r) ? this.width - r : x;
        current[1] = (y < r) ? r : (y > this.height - r) ? this.height - r : y;
    },

    /**
     * Move the system forward one step in time by satisfying all of the constraints and moving the
     * points.
     */
    step: function(){
        var i, l;

        for (i = 0, l = this.constraints_.length; i < l; i++)
            this.constraints_[i].satisfy(World.DT);

        for (i = 0, l = this.interactivePoints_.length; i < l; i++)
            this.interactivePoints_[i].move(World.DT);

        for (i = 0, l = this.nonInteractivePoints_.length; i < l; i++)
            this.nonInteractivePoints_[i].move(World.DT);
    },

    /**
     * Converts a points current location from world coordinates to
     *
     * @param {Point} point The point to be converted.
     *
     * @return {vec2} The point's current position converted to pixels.
     */
    toPixelsVec: function(vec){
        return vec2.multiply(vec, this.scale_, vec2.create());
    },

    /**
     * Converts a single value (usually constants) from world coordinates to pixels.
     *
     * @param {number} value The value to be converted.
     *
     * @return {number} The value converted to pixels.
     */
    toPixelsValue: function(value){
        return value * this.maxScale_;
    },

    /**
     * Returns a vec2 with a random x and y within the bounds of the world.
     *
     * @return {vec2}
     */
    getRandomVec2: function(){
        return vec2.createFrom(this.width * Math.random(), this.height * Math.random());
    },

    /**
     * Detects if two points are currently overlapping and adjusts them so they are not.
     *
     * @param {Point} point1
     * @param {Point} point2
     * @private
     */
    collidePoints_: function(point1, point2){
        var between = vec2.subtract(point1.current, point2.current, vec2.create());
        var distance = vec2.length(between) - point1.radius - point2.radius;

        if (distance >= 0) return;

        var direction = vec2.normalize(between, vec2.create());
        var adjustment = vec2.scale(direction, -distance/2, vec2.create());

        vec2.add(point1.current, adjustment, point1.current);
        vec2.subtract(point2.current, adjustment, point2.current);
    }
};

/**
 * The time (in ms) to move the system ahead at every step.
 *
 * @type {number}
 * @static
 */
World.DT = 16;

/**
 * The minimum dimension to be used by the system.
 *
 * @type {number}
 * @static
 */
World.MIN_DIMENSION = 10;