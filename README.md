This is the codebase used for EITI-NL dataportaal. Another version is being used to update open data dashboard for Institute Mijnbouwschade Groningen. 
At present there is no boilerplate version. If you would like to re-use the codebase, do contact me at joera@joeramulders.com. I would be happy to help strip it down and make a more generic version.

The codebase can be seen as a wrapper around d3.js, with added functionality based on best practices and other lessons learned over the years. 
These learnings mainly involve accessibility for the visually impaired, as well as a large group of people whom prefer to read numbers in tables rather than interprete graphs. 
When you are reading this there is a good chance that you like or love (making) beautiful and complex graphs. The hard truth is that few people do. 

There is a consistency implemented whereby each (group of) graph(s), corresponds to a single data table (also downloadable) and a set of definitions exlaining all parameters, and ideally a single endpoint queriable in a swagger interface. I have learned this helps me focus on the message. 

The dashboard/dataportal is a single page app, that can run inside another html page, needing a html element and a script tag linking to a file of compiled typescript. 
Navigation between pages works through url query strings. Each page has a configuration in a ts object that could also be json. [Example]
