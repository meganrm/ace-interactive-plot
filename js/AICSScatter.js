
function AICSScatter(model, my){

    my = my || {};

    var TIP_WIDTH = 50;
    var TIP_HEIGHT = 50;

    var that = AICSChart(model, my);

    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();

    var dotGs = undefined;
    var ims = undefined;
    var dots = undefined;

    // model.handleClick = model.handleClick || function (d, tipDiv){
    //     d.showToolTip = !d.showToolTip;
    //     _updateDots(1);
        // tipDiv.on('mouseout', d.showToolTip ? undefined : function () {
        //     _handleMouseOut(d);
        // });
        // if(!d.showToolTip){
        //     d.mouseOverTooltip.div.style('visibility', 'hidden');
        // }
    // };
    model.handleClick = model.handleClick || function (d, tipDiv) {
        d.showToolTip = !d.showToolTip;
        _updateDots(1);
    };

    function _yScaleAccessor(elem) {
        return Number(elem[model.yAxisDomain]);
    };

    function _xScaleAccesor(elem) {
        return Number(elem[model.xAxisDomain]);
    };

    function _handleMouseOver(d) {
        // var that = this;
        // if(!d.mouseOverTooltip){
        //     d.mouseOverTooltip = _createToolTip(d, that);
        // }
        // d.mouseOverTooltip.div.style('visibility', 'visible');
    };

    function _handleMouseOut(d) {
        // d.mouseOverTooltip.div.style('visibility', 'hidden');
    };

    function _createToolTip(circleD) {
        var tipDiv = d3.select('body')
            .append('div')
            .attr('class', 'tip')
            .style('position', 'absolute')
            .style('left', (model.margin.left + xScale(circleD[model.xAxisDomain]) - (TIP_WIDTH / 2)) + 'px')
            .style('top', (model.margin.top + yScale(circleD[model.yAxisDomain]) - (TIP_HEIGHT / 2)) + 'px')
            .on('click', function () {
                model.handleClick(circleD, tipDiv);
            })
            .on('mouseout', function () {
                _handleMouseOut(circleD)
            });
        var tipImage = tipDiv.append('img')
            .attr('width', TIP_WIDTH)
            .attr('height', TIP_HEIGHT);
        tipImage.attr('src', 'modeling/images/' + circleD.im_ids + '.ome.tif_flat.png');
        tipDiv.append("xhtml:br");
        tipDiv.append("xhtml:span").style('font-weight', 'bold').text(function (d) {
            return model.xAxisDomain + ': ' + circleD[model.xAxisDomain];
        });
        tipDiv.append("xhtml:br");
        tipDiv.append("xhtml:span").style('font-weight', 'bold').text(function (d) {
            return model.yAxisDomain + ': ' + circleD[model.yAxisDomain];
        });
        return {div: tipDiv, image: tipImage};
    }
    var xAxis = d3.axisBottom();
    var yAxis = d3.axisLeft();
    model.filterClasses = {};
    my.init = function(){
        model.data.forEach(function (d) {
            model.filterClasses[d.classes] = true;
            d.showToolTip = false;
        });
        xScale.domain([d3.min(model.data, _xScaleAccesor), d3.max(model.data, _xScaleAccesor)])
            .range([ 0, my.chartWidth ]);
        yScale.domain([d3.min(model.data, _yScaleAccessor), d3.max(model.data, _yScaleAccessor)])
            .range([ my.chartHeight, 0 ]);
        xAxis.scale(xScale);
        yAxis.scale(yScale);
    };

    function _updateScales(transitionDuration) {
        xScale.domain([d3.min(model.data, _xScaleAccesor), d3.max(model.data, _xScaleAccesor)])
            .range([ 0, my.chartWidth ]);
        yScale.domain([d3.min(model.data, _yScaleAccessor), d3.max(model.data, _yScaleAccessor)])
            .range([ my.chartHeight, 0 ]);
        d3.select('#xaxis')
            .transition()
            .duration(transitionDuration || 2500)
            .attr('transform', 'translate(0,' + my.chartHeight + ')')
            .call(xAxis);
        d3.select('#yaxis')
            .transition()
            .duration(transitionDuration || 2500)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);
    };

    function _updateDots(transitionDuration){
        dots.transition()
            .duration(transitionDuration || 2500)
            .attr('cx', function (d){
                return xScale(d[model.xAxisDomain]);
            })
            .attr('cy', function (d) {
                return yScale(d[model.yAxisDomain]);
            });

        dotGs.transition()
            .duration(transitionDuration || 2500)
            .attr('visibility', function (d) {
                return model.filterClasses[d.classes] ? 'visible' : 'hidden';
            });

        ims.transition()
            .duration(transitionDuration || 2500)
            .attr('x', function (d){
                return xScale(d[model.xAxisDomain]);
            })
            .attr('y', function (d) {
                return yScale(d[model.yAxisDomain]);
            })
            .attr("xlink:href", function (d) {
                if(d.showToolTip){
                    console.log(d.im_ids);
                }
                return d.showToolTip ? 'modeling/images/' + d.im_ids + '.ome.tif_flat.png' : '';
            });

    }

    my.update = function (transitionDuration) {
        _updateScales(transitionDuration);
        _updateDots(transitionDuration);
    };

    my.build = function (main) {
        main.append('g')
            .attr("id", "xaxis")
            .attr('transform', 'translate(0,' + my.chartHeight + ')')
            .attr('class', 'axis')
            .call(xAxis);
        main.append('g')
            .attr('id', 'yaxis')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'axis')
            .call(yAxis);

        dotGs = main.append('svg:g').selectAll('scatter-dots')
            .data(model.data)
            .enter()
            .append('g');

        ims = dotGs.append("svg:image")
            .attr('x', my.chartWidth/2)
            .attr('y', my.chartHeight/2)
            .attr('width', 50)
            .attr('height', 50)
            .attr("xlink:href", function (d) {
                return d.showToolTip ? 'modeling/images/' + d.im_ids + '.ome.tif_flat.png' : '';
            });

        dots = dotGs.append('circle')
            .attr('r', 6)
            .attr('width', 20)
            .attr('height', 24)
            .attr('opacity', .3)
            .attr('fill', 'blue')
            .attr('stroke','black')
            .attr('stroke-width',0)
            .attr('cx', my.chartWidth/2)
            .attr('cy', my.chartHeight/2)
            .on('mouseover',function(d) {
                _handleMouseOver(d);
            })
            .on('click', model.handleClick);
        _updateDots();
    };

    my.ready = function () {
        model.data.forEach(function (elem) {
            if(elem.tip){
                model.handleClick(elem)
            }
        });
    };

    return that;
};