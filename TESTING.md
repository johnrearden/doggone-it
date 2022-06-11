# Testing

## Setting up test environment
In planning the project, I decided to make use of ES6 modules for code modularity purposes, with the understanding at the time
that they were broadly supported. On the suggestion of my course facilitator, I decided to run some automated tests on my code using
jest, as covered in later lectures on the course. I didn't understand the difference between NPM's commonJS approach to code orginisation
(module.exports and require) as opposed to the ES6 approach (import and export), so I was faced with a situation where either
-   my code wouldn't run on the browser due to the require statements, or
-   my code wouldn't run under npm with jest as the testing framework due to the presence of import and export statements.

After some (a lot of) research, I found the following blogposts
[es-modules-in-node-today](https://blog.logrocket.com/es-modules-in-node-today/)
[transpile-es-modules-with-webpack-node-js](https://blog.logrocket.com/transpile-es-modules-with-webpack-node-js/)
and the following Stack Overflow answer on the subject of transpilation 
[jest-gives-an-error-syntaxerror-unexpected-token-export](https://stackoverflow.com/a/49679658)

As I wasn't sure how to configure GitPod to install jest on launch, and I wasn't sure if I could persist any environment I set up
on the GitPod workspace across sessions, I cloned the project to a repo on my local machine and set up the environment there instead, 
following the instructions provided in the Stack Overflow answer.

It worked. For now, I'll write any tests I need in the local repo and push them up to Github. I intend to contact Tutor Support to 
investigate if I can duplicate the babel/jest setup on GitPod so that my mentor and others can run my tests in the shared workspace.