function ACEScatterView(spec){
    var that = {};
    var scatter = AICSScatter({
        controls: spec.controlsParent,
        parent: spec.chartParent,
        dataFile: spec.dataFile,
        xAxisDomain: spec.xAxisDomain,
        yAxisDomain: spec.yAxisDomain
    });
    scatter.init();
    return that;
};