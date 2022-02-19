/*
 * qWikiOffice Desktop 0.7
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

QoDesk.ChartsWindow = Ext.extend(Ext.app.Module, {
    id: 'demo-charts',
    type: 'demo/charts',

    init: function () {

    },

    addons: [
        'chart-js'
    ],

    chartColors: {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    },

    randomScalingFactor: function () {
        let min = Math.ceil(-100);
        let max = Math.floor(100);
        return Math.floor(Math.random() * (max - min) + min);
    },

    createWindow: function () {
        let desktop = this.app.getDesktop();
        let win = desktop.getWindow('charts-win');
        let self = this;
        let color = Chart.helpers.color;

        if (!win) {
            let winWidth = desktop.getWinWidth() / 1.1;
            let winHeight = desktop.getWinHeight() / 1.1;

            win = desktop.createWindow({
                id: 'charts-win',
                title: 'Charts Window',
                width: winWidth,
                height: winHeight,
                x: desktop.getWinX(winWidth),
                y: desktop.getWinY(winHeight),
                iconCls: 'layout-icon',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                minimizable: true,
                maximizable: true,
                layout: 'fit',
                tbar: [],
                items: [{
                    xtype: 'panel',
                    autoScroll:true,
                    layout: 'table',
                    defaults: {
                        // applied to each contained panel
                        bodyStyle: 'padding:20px'
                    },
                    layoutConfig: {
                        // The total column count must be specified here
                        columns: 2
                    },
                    items: [
                        {
                            xtype: 'panel',
                            width: winWidth / 2.2,
                            border: false,
                            items: [
                                new Ext.ux.Chartjs({
                                    type: 'bar',
                                    data: {
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [{
                                            label: 'Dataset 1',
                                            backgroundColor: color(self.chartColors.red).alpha(0.5).rgbString(),
                                            borderColor: self.chartColors.red,
                                            borderWidth: 1,
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor()
                                            ]
                                        }, {
                                            label: 'Dataset 2',
                                            backgroundColor: color(self.chartColors.blue).alpha(0.5).rgbString(),
                                            borderColor: self.chartColors.blue,
                                            borderWidth: 1,
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor()
                                            ]
                                        }]

                                    },
                                    options: {
                                        responsive: true,
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Bar Chart'
                                        }
                                    }
                                })
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            width: winWidth / 2.2,
                            items: [
                                new Ext.ux.Chartjs({
                                    type: 'line',
                                    data: {
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [{
                                            label: 'My First dataset',
                                            borderColor: self.chartColors.red,
                                            backgroundColor: self.chartColors.red,
                                            fill: false,
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor()
                                            ],
                                            yAxisID: 'y-axis-1',
                                        }, {
                                            label: 'My Second dataset',
                                            borderColor: self.chartColors.blue,
                                            backgroundColor: self.chartColors.blue,
                                            fill: false,
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor()
                                            ],
                                            yAxisID: 'y-axis-2'
                                        }]
                                    },
                                    options: {
                                        responsive: true,
                                        hoverMode: 'index',
                                        stacked: false,
                                        title: {
                                            display: true,
                                            text: 'Line Chart - Multi Axis'
                                        },
                                        scales: {
                                            yAxes: [{
                                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: true,
                                                position: 'left',
                                                id: 'y-axis-1',
                                            }, {
                                                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: true,
                                                position: 'right',
                                                id: 'y-axis-2',

                                                // grid line settings
                                                gridLines: {
                                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                },
                                            }],
                                        }
                                    }
                                })
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            width: winWidth / 2.2,
                            items: [
                                new Ext.ux.Chartjs({
                                    type: 'doughnut',
                                    data: {
                                        datasets: [{
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                            ],
                                            backgroundColor: [
                                                self.chartColors.red,
                                                self.chartColors.orange,
                                                self.chartColors.yellow,
                                                self.chartColors.green,
                                                self.chartColors.blue,
                                            ],
                                            label: 'Dataset 1'
                                        }],
                                        labels: [
                                            'Red',
                                            'Orange',
                                            'Yellow',
                                            'Green',
                                            'Blue'
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Doughnut Chart'
                                        },
                                        animation: {
                                            animateScale: true,
                                            animateRotate: true
                                        }
                                    }
                                })
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            width: winWidth / 2.2,
                            items: [
                                new Ext.ux.Chartjs({
                                    region: 'center',
                                    type: 'pie',
                                    data: {
                                        datasets: [{
                                            data: [
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                                self.randomScalingFactor(),
                                            ],
                                            backgroundColor: [
                                                self.chartColors.red,
                                                self.chartColors.orange,
                                                self.chartColors.yellow,
                                                self.chartColors.green,
                                                self.chartColors.blue,
                                            ],
                                            label: 'Dataset 1'
                                        }],
                                        labels: [
                                            'Red',
                                            'Orange',
                                            'Yellow',
                                            'Green',
                                            'Blue'
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        hoverMode: 'index',
                                        stacked: false,
                                        title: {
                                            display: true,
                                            text: 'Pie Chart'
                                        },
                                    }
                                })
                            ]
                        }
                    ],
                }],

                taskbuttonTooltip: '<b>Charts Window</b><br />Charts layout window'
            });
        }
        win.show();
    }
});