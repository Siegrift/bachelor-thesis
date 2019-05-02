/*
	This file stores the compiler/interpretor details that are provided to DockerSandbox.sh The index
	is the key field, First column contains the compiler/interpretor that will be used for translation
	Second column is the file name to use when storing the source code Third column is optional, it
	contains the command to invoke the compiled program, it is used only for compilers Fourth column
	is just the language name for display on console, for verbose error messages Fifth column is
	optional, it contains additional arguments/flags for compilers

	You can add more languages to this API by simply adding another row in this file along with
	installing it in your Docker VM.
*/

// NOTE: This file serves only as a documentation of how to compile and run the code.
// Current implementation forces you to create a custom compile script for the sources.

// const codeRunners = new Map<string, string[]>()
// codeRunners.set('python3', ['python3', 'file.py', '', 'Python 3', ''])
// codeRunners.set('python', ['python', 'file.py', '', 'Python', ''])
// codeRunners.set('ruby', ['ruby', 'file.rb', '', 'Ruby', ''])
// codeRunners.set('clojure', ['clojure', 'file.clj', '', 'Clojure', ''])
// codeRunners.set('php', ['php', 'file.php', '', 'Php', ''])
// codeRunners.set('nodejs', ['nodejs', 'file.js', '', 'Nodejs', ''])
// codeRunners.set('scala', ['scala', 'file.scala', '', 'Scala', ''])
// codeRunners.set('go', ["'go run'", 'file.go', '', 'Go', ''])
// codeRunners.set('c++', [
//   "'g++ -o /usercode/a.out' ",
//   'file.cpp',
//   '/usercode/a.out',
//   'C/C++',
//   '',
// ])
// // TODO: enable java
// // ['javac', 'file.java', "'./usercode/javaRunner.sh'", 'Java', ''],
// codeRunners.set('vbnc', [
//   "'vbnc -nologo -quiet'",
//   'file.vb',
//   "'mono /usercode/file.exe'",
//   'VB.Net',
//   '',
// ])

// codeRunners.set('gmcs', [
//   'gmcs',
//   'file.cs',
//   "'mono /usercode/file.exe'",
//   'C#',
//   '',
// ])
// codeRunners.set('bash', ['/bin/bash', 'file.sh', ' ', 'Bash', ''])
// codeRunners.set('obj-c', [
//   'gcc ',
//   'file.m',
//   ' /usercode/a.out',
//   'Objective-C',
//   "' -o /usercode/a.out -I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall -fconstant-string-class=NSConstantString'",
// ])
// codeRunners.set('mysql', [
//   '/usercode/sql_runner.sh',
//   'file.sql',
//   '',
//   'MYSQL',
//   '',
// ])
// codeRunners.set('perl', ['perl', 'file.pl', '', 'Perl', ''])
// codeRunners.set('rust', [
//   "'env HOME=/opt/rust /opt/rust/.cargo/bin/rustc'",
//   'file.rs',
//   '/usercode/a.out',
//   'Rust',
//   "'-o /usercode/a.out'",
// ])

// export default codeRunners
