import * as Long from "long";

export class Utils {
    public static times(n: number, iterator: any) {
        var list = Array(Math.max(0, n));
        for (var i = 0; i < n; i++)
            list[i] = iterator.call(iterator, i);
        return list;
    }; 

    public static forEach(init: number, end: number, iterator: any) {
        for (var i = init; i <= end; i++) {
            iterator.call(iterator, i);
        }
    }

    public static loadResource(filename: string, filetype: string): void {
        if (filetype == "js") {
            var fileref: any = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        } else if (filetype == "css") {
            var fileref: any = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }

    public static longPos(position: number): Long {
        return Utils.longPow(2, position);
    }

    public static longPow(base: number, exponential: number): Long {
        var result = Long.fromInt(1);
        for (var i = 0; i < exponential; i++) {
            result = result.multiply(base);            
        }
        return result;
    }
}