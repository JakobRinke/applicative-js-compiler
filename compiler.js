

function compile_to_js(code) {

    var c = translate_functions(code);

    c = c.replace(/\t/g, " ");


    // if then else fi
    c = c.replace(/ if /g, " eval(` if (");
    c = c.replace(/ else /g, " } else { ");
    c = c.replace(/ fi /g, "  }`) ");
    c = c.replace(/ fi;/g, " }`) ");
    c = c.replace(/ then /g, " ){ ");

    // math 
    c = c.replace(/ mod /g, "%");
    c = c.replace(/ sign /g, "Math.sign");
    c = c.replace(/ abs /g, "Math.abs");
    c = c.replace(/ sin /g, "Math.sin");
    c = c.replace(/ cos /g, "Math.cos");
    

    // logic
    c = c.replace(/and/g, "&&");
    c = c.replace(/∧/g, "&&");
    c = c.replace(/or/g, "||");
    c = c.replace(/∨/g, "||");
    c = c.replace(/not/g, "!");
    c = c.replace(/¬/g, "!");
    c = c.replace(/=/g, "==");
    c = c.replace(/<==/g, "<=");
    c = c.replace(/>==/g, ">=");
    c = c.replace(/≠/g, "!=");

    c = c.replace(/\n/g, " ");

    c = consider_if_depth(c);

    return c;
}


function translate_functions(code) {
    code += "\n";
    lines = code.split("\n");
    var opened = false;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        if (line == "" && opened) {
            lines[i] = "}";
            opened = false;
        }
        if (!line.includes(":=")) {
            continue;
        }
        parts = line.split(":=");
        part1 = parts[0];
        part2 = parts[1];
        var tg = "function " + part1 + " { return " + part2
        if (opened) {
            tg = "}\n" + tg;
        } 
        lines[i] = tg;
        opened = true;
    }

    if (opened) {
        lines.push("}");
    }

    return lines.join(" \n ");
}

function n_times(char, n) {
    var s = "";
    for (var i = 0; i < n; i++) {
        s += char;
    }
    return s;
}


function consider_if_depth(code) {
    var depth = 0;
    var tokens = code.split("");

    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] == "{") {
            depth++;
            continue;
        }
        if (tokens[i] == "}") {
            depth--;
            continue;
        }
        if (tokens[i] == "`") {
            tokens[i] = n_times("\\", depth-1) + "`";
        }
    }
    return tokens.join("");
}







const apl_el = document.getElementById("applicative");
const js_el = document.getElementById("js");

const test_in_el = document.getElementById("test_in");
const test_out_el = document.getElementById("test_out");


var compiling = false;

function start_compilation() {
    if (compiling) {
        alert("Kompilierung und ausführung läuft bereits. Vielleicht hast du eine Endlosschleife?");
        return;
    }

    compiling = true;

    var apl_code = apl_el.value;

    var js_code = compile_to_js(apl_code);

    js_el.value = js_code;

    // test 
    var testinput = test_in_el.value.split("\n");
    var testoutput = "";
    for (var i = 0; i < testinput.length; i++) {
        if (testinput[i] == "") {
            continue;
        }
        var t = js_code + "; " + testinput[i];
        try {
            testoutput += eval(t) + "\n";
        } catch (e) {
            testoutput += e + "\n";
        }
    }

    test_out_el.value = testoutput;

    compiling = false;

}



var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
        if(e.keyCode==9 || e.which==9){
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s+1; 
        }
    }
}

function perfekt(n)  { return  eval(` if (n <= 1 ){ false   } else { sumDiv(n, n - 1) == n  }`)   }   function sumDiv(n, d)  { return    eval(` if (d == 0 ){ 0   } else { eval(\` if (n%d == 0 ){ d +sumDiv(n, d - 1)   } else { sumDiv(n, d - 1)  }\`)    }`)   }