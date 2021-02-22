Expression
  = (Comment / Numeric / Word / String / Block)+

Numeric
  = _ ([+-])?[0-9]+("."[0-9]+)? { return ['num', parseFloat(text())]; }

Word
  = _ [#a-zA-Z|][#a-zA-Z0-9_|]* { return ['word', text().trim()]; }

String
  = _ '"' ("\\\""/[^"])* '"' { return ['str', text()]; }
  
Block
  = _ "{" _ subexpr:Expression _ "}" { return ['block', subexpr] }

Comment
  = _ "//" [^\n]* { return ['comment', null] }

_ "whitespace"
  = [ \t\n\r]*