Expression
  = (Comment / Word / Numeric / String / Block)+

Numeric
  = _ ([+-])?[0-9]+("."[0-9]+)? { return ['num', parseFloat(text())]; }

Boolean
  = _ "true"/"false" { return ['bool', text()==="true"] }

Word
  = _ [#a-zA-Z\-\/|<.+*][*.\->#a-zA-Z0-9_|]* { return ['word', text().trim()]; }

String
  = _ '"' ("\\\""/[^"])* '"' { return ['str', text()]; }
  
Block
  = _ "{" _ subexpr:Expression _ "}" { return ['block', subexpr] }

Comment
  = _ "//" [^\n]* { return ['comment', null] }

_ "whitespace"
  = [ \t\n\r]*