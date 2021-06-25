install: all
	cp output/plants/* ../src/img/plants/
	cp output/controllers/* ../src/img/controllers/

all:
	ls plants | xargs -I plantname make output/plants/plantname.svg
	ls controllers | xargs -I controllername make output/controllers/controllername.svg

output/%.svg: output/%.pdf
	convert -density 600 output/$*.pdf output/$*.svg

output/%.pdf: %
	mkdir -p output/plants output/controllers
	cp $* /tmp/current.tikz
	pdflatex -halt-on-error -output-directory=output template.tex
	mv output/template.pdf output/$*.pdf
	rm output/template.*

clean:
	rm -r output
