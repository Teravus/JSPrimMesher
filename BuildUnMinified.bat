cls
del jsprimmesher.js
ren jsprimmesher.min.js jsprimmesher.min.je
type "Combined.head" > jsprimmesher.je
for %%f in (*.js) do type "%%f" >> jsprimmesher.je
ren jsprimmesher.je jsprimmesher.js
ren jsprimmesher.min.je jsprimmesher.min.js
