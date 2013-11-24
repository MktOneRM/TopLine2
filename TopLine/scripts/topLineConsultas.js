(function($, undefined) {
	kendo.data.binders.cabecalho = kendo.data.Binder.extend({
		init: function (element, bindings, options) {
			kendo.data.Binder.fn.init.call(this, element, bindings, options); 
			this.dateformat = $(element).data("dateformat");
		},
		refresh: function () {
			var data = this.bindings["cabecalho"].get();
			if (data) {
				var dateObj = new Date(data);
				$(this.element).text(kendo.toString(dateObj, this.dateformat, "pt-BR") + " Vendas - Até " + kendo.toString(new Date(), "HH:mm") + " Hs");
			}
		}
	});
	
	kendo.data.binders.cabecalhoMetas = kendo.data.Binder.extend({
		init: function (element, bindings, options) {
			kendo.data.Binder.fn.init.call(this, element, bindings, options); 
			this.dateformat = $(element).data("dateformat");
		},
		refresh: function () {
			var data = this.bindings["cabecalhoMetas"].get();
			if (data) {
				var dateObj = new Date(data);
				$(this.element).text(kendo.toString(dateObj, this.dateformat, "pt-BR") + " Metas - Até " + kendo.toString(new Date(), "HH:mm") + " Hs");
			}
		}
	});
   
	kendo.data.binders.hora = kendo.data.Binder.extend({
		refresh: function() {
			var value = this.bindings["hora"].get();
			if (value) {
				$(this.element).text(kendo.toString(value.substring(0, 5)));
			}
		}
        
	});

	kendo.data.binders.qtdeConsulta = kendo.data.Binder.extend({
		refresh: function() {
			var that = this,
			valor = that.bindings["qtdeConsulta"].get(), //get the value from the View-Model
			formatedValue = kendo.toString(valor, "n0", "pt-BR"); //format
			$(that.element).text(formatedValue); //update the HTML input element
		}
	});

	kendo.data.binders.dateText = kendo.data.Binder.extend({
		refresh: function() {
			var that = this,
			value = that.bindings["dateText"].get(); //get the value from the View-Model
			if (value) {
				formatedValue = kendo.toString(value, "dd/MM/yyyy"); //format				
				$(that.element).text(formatedValue); //update the HTML input element
			}     
		}
	});	
	
	kendo.data.binders.valorMonetario = kendo.data.Binder.extend({
		refresh: function () {
			var that = this,
			value = that.bindings["valorMonetario"].get(), //get the value from the View-Model
			formatedValue = kendo.toString(value, "N2", "pt-BR"); //format
			$(that.element).text(formatedValue); //update the HTML input element
		}
	});

	kendo.data.binders.valorPercentual = kendo.data.Binder.extend({
		refresh: function () {
			var that = this,
			value = that.bindings["valorPercentual"].get(), //get the value from the View-Model
			formatedValue = kendo.toString(value, "p2", "pt-BR"); //format
			$(that.element).text(formatedValue); //update the HTML input element
		}
	});

	//Função para tramento de erro!
	function DataSource_Error(e) {
		app.application.hideLoading();
		app.error.showError("Houve um erro ao carregar os dados do servidor. Feche o aplicativo e tente novamente.", e);
	}
	
	//Schema Atendimento
	var scDesRealizadoVenda = { 
		model: {
			id: "RedeLojaId",
			fields:{
				RedeLojaId: { editable: false, nullable: false },
				LojaId: { editable: false, nullable: false },
				LojaColId: { editable: false, nullable: false },
				HfuId: { editable: false, nullable: false },
				MetaData: { editable: false, nullable: false },
				MetaHora: { editable: false, nullable: false },
				MetaRealizadoVlVenda: { editable: false, nullable: false },
				MetaRealizadoQtPecas: { editable: false, nullable: false },
				DataInicialMeta: { editable: false, nullable: false },
				DataFinalMeta: { editable: false, nullable: false },
				MetaRealizadoAcumulado: { editable: false, nullable: false }
			} 
		}
	};
    
	var scPadraoProdutividade = { 
		model: {
			id: "Id",
			fields:{
				DescricaoMotivo: { editable: false, nullable: false },
				Quantidade: { editable: false, nullable: false },
				Percentual: { editable: false, nullable: false }			
			} 
		}
	};
    
	var scMetasDiarias = { 
		model: {
			id: "Id",
			fields:{
				Dia: { type:"date", editable: false, nullable: false },
				Previsto: { editable: false, nullable: false },
				Realizado: { editable: false, nullable: false },
				Percentual: { editable: false, nullable: false }			
			} 
		}
	};
	
	//dataSource Atendimento
	var dsDesRealizadoCol = new kendo.data.DataSource({                    
		transport: {						
			read:  {
				url: viewModelUrl.serviceUrl + "/RmDesempenho",							
				type:"GET"      
				,contentType: "application/json"
				,dataType: "json"
			},
			parameterMap: function(data, operation) {
				if (operation == "read") {
					return {
						lojaId: viewModelConsultas.pLojId,
						hfuId: viewModelConsultas.pTufId, 
						lojaColId: viewModelConsultas.pLojColId,
						noDia: viewModelConsultas.consultaDia, 
						ateData: viewModelConsultas.consultaAteData
					}
				}
				else if (operation !== "read" && data.models) {							
					return kendo.stringify(data.models[0]);
				}
			}
		},
		batch: true,
		schema: scDesRealizadoVenda,        
		sort: {
			field: "MetaHora",
			dir: "asc"
		},
		change: function(e) {
			viewModelConsultas.set("resultado", this.view());
		},
		requestStart: function() {
			app.application.showLoading()
		},
		error: DataSource_Error
	});
    
	
	
	var dsProdutividadeVendasPerdidas = new kendo.data.DataSource({                    
		transport: {						
			read:  {
				url: viewModelUrl.serviceUrl + "/TplProdutividadeVendasPerdidas",							
				type:"GET"      
				,contentType: "application/json"
				,dataType: "json"
			},
			parameterMap: function(data, operation) {
				if (operation == "read") {
					return {
						idLoja: viewModelConsultas.pLojId,
						idTurno: viewModelConsultas.pTufId, 
						idColaborador: viewModelConsultas.pLojColId
					}
				}
				else if (operation !== "read" && data.models) {							
					return kendo.stringify(data.models[0]);
				}
			}
		},
		batch: true,
		schema: scPadraoProdutividade,        
		sort: {
			field: "DescricaoMotivo",
			dir: "asc"
		},
		change: function(e) {
			viewModelConsultas.set("resultProdutividadeVendasPerdidas", this.view());
		},
		requestStart: function() {
			app.application.showLoading()
		}
	});
	
	dsProdutividadeVendasPerdidas.bind("error", DataSource_Error);
	
	var dsProdutividadeAfastamentos = new kendo.data.DataSource({                    
		transport: {						
			read:  {
				url: viewModelUrl.serviceUrl + "/TplProdutividadeAfastamento",							
				type:"GET"      
				,contentType: "application/json"
				,dataType: "json"
			},
			parameterMap: function(data, operation) {
				if (operation == "read") {
					return {
						idLoja: viewModelConsultas.pLojId,
						idTurno: viewModelConsultas.pTufId, 
						idColaborador: viewModelConsultas.pLojColId
					}
				}
				else if (operation !== "read" && data.models) {							
					return kendo.stringify(data.models[0]);
				}
			}
		},
		batch: true,
		schema: scPadraoProdutividade,        
		sort: {
			field: "DescricaoMotivo",
			dir: "asc"
		},
		change: function(e) {
			viewModelConsultas.set("resultProdutividadeAfastamento", this.view());
		},
		requestStart: function() {
			app.application.showLoading()
		}
	});
	
	dsProdutividadeAfastamentos.bind("error", DataSource_Error);
    
	var dsMetasDiarias = new kendo.data.DataSource({                    
		transport: {						
			read:  {
				url: viewModelUrl.serviceUrl + "/TplMetasDiarias",							
				type:"GET"      
				,contentType: "application/json"
				,dataType: "json"
			},
			parameterMap: function(data, operation) {
				if (operation == "read") {
					return {
						idLoja: viewModelConsultas.pLojId,
						idTurno: viewModelConsultas.pTufId, 
						idColaborador: viewModelConsultas.pLojColId
					}
				}
				else if (operation !== "read" && data.models) {							
					return kendo.stringify(data.models[0]);
				}
			}
		},
		batch: true,
		schema: scMetasDiarias,        
		sort: {
			field: "Dia",
			dir: "asc"
		},
		change: function(e) {
			viewModelConsultas.set("resultMetasDiarias", this.view());
		},
		requestStart: function() {
			app.application.showLoading()
		}
	});
		
	dsMetasDiarias.bind("error", DataSource_Error);
	
	var viewModelConsultas = kendo.observable({	
		dsDesRealizadoCol: dsDesRealizadoCol,
		dsProdutividadeVendasPerdidas: dsProdutividadeVendasPerdidas,
		dsProdutividaAfastamento: dsProdutividadeAfastamentos,
		dsMetasDiarias: dsMetasDiarias,
  
		lojaSelecionada: [],
		colaboradorSelecionado: [],
		turnoSelecionado: [],        
		consultaDia: false,
		consultaAteData: true,
		dataAtual: "",
        
		pLojId: "null",
		pTufId: "null",
		pLojColId: "null",
                
		resultado: [],
		resultProdutividadeVendasPerdidas: [],
		resultProdutividadeAfastamento: [],
		resultMetasDiarias: [],
        
	})
    
	function desRealizadoColShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));		
		viewModelConsultas.set("colaboradorSelecionado", viewModel.get("colaboradorSelecionado"));
        
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId);
		viewModelConsultas.set("pLojColId", viewModelConsultas.colaboradorSelecionado.ColId); 
		viewModelConsultas.set("pTufId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsDesRealizadoCol.read();
	}
    
	function desRealizadoLojaShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", "null"); 
		viewModelConsultas.set("pLojColId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsDesRealizadoCol.read();
	}
        
	function desRealizadoTurnoShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("turnoSelecionado", viewModel.get("turnoSelecionado"));		      
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", viewModelConsultas.turnoSelecionado.TufId); 	
		viewModelConsultas.set("pLojColId", "null");
        
		//Efetua a leitura do Datasource.
		dsDesRealizadoCol.read();
	}

	function desProdutividadeVendasPerdidasColShow() {	
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));		
		viewModelConsultas.set("colaboradorSelecionado", viewModel.get("colaboradorSelecionado"));
        
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId);
		viewModelConsultas.set("pLojColId", viewModelConsultas.colaboradorSelecionado.ColId); 
		viewModelConsultas.set("pTufId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsProdutividadeVendasPerdidas.read();
	}
    
	function desProdutividadeVendasPerdidasLojaShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", "null"); 
		viewModelConsultas.set("pLojColId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsProdutividadeVendasPerdidas.read();
	}
        
	function desProdutividadeVendasPerdidasTurnoShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("turnoSelecionado", viewModel.get("turnoSelecionado"));		      
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", viewModelConsultas.turnoSelecionado.TufId); 	
		viewModelConsultas.set("pLojColId", "null");
        
		//Efetua a leitura do Datasource.
		dsProdutividadeVendasPerdidas.read();
	}
    
	function desProdutividadeAfastamentoColShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));		
		viewModelConsultas.set("colaboradorSelecionado", viewModel.get("colaboradorSelecionado"));
        
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId);
		viewModelConsultas.set("pLojColId", viewModelConsultas.colaboradorSelecionado.ColId); 
		viewModelConsultas.set("pTufId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsProdutividadeAfastamentos.read();
	}
    
	function desProdutividadeAfastamentoLojaShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", "null"); 
		viewModelConsultas.set("pLojColId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsProdutividadeAfastamentos.read();
	}
        
	function desProdutividadeAfastamentoTurnoShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("turnoSelecionado", viewModel.get("turnoSelecionado"));		      
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", viewModelConsultas.turnoSelecionado.TufId); 	
		viewModelConsultas.set("pLojColId", "null");
        
		//Efetua a leitura do Datasource.
		dsProdutividadeAfastamentos.read();
	}
    
	//Metas Diarias
	function metasDiariasColShow() {	
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));		
		viewModelConsultas.set("colaboradorSelecionado", viewModel.get("colaboradorSelecionado"));
        
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId);
		viewModelConsultas.set("pLojColId", viewModelConsultas.colaboradorSelecionado.ColId); 
		viewModelConsultas.set("pTufId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsMetasDiarias.read();
	}
    
	function metasDiariasLojaShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", "null"); 
		viewModelConsultas.set("pLojColId", "null"); 
        
		//Efetua a leitura do Datasource.
		dsMetasDiarias.read();
	}
        
	function metasDiariasTurnoShow() {
		viewModelConsultas.set("dataAtual", new Date());
		viewModelConsultas.set("lojaSelecionada", viewModel.get("lojaSelecionada"));
		viewModelConsultas.set("turnoSelecionado", viewModel.get("turnoSelecionado"));		      
		viewModelConsultas.set("pLojId", viewModelConsultas.lojaSelecionada.LojId); 
		viewModelConsultas.set("pTufId", viewModelConsultas.turnoSelecionado.TufId); 	
		viewModelConsultas.set("pLojColId", "null");
        
		//Efetua a leitura do Datasource.
		dsMetasDiarias.read();
	}
	
	function GrafDesRealizadoColShow() {    
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesRealizadoVenda("#chtGrafDesRealizadoVendaCol");
			$("#grafDesRealizadoCol-view").bind("kendo:skinChange", function(e) {
				grafDesRealizadoVenda("#chtGrafDesRealizadoVendaCol");
			});
		}, 100);
	};
    
	function GrafDesRealizadoLojaShow() {   
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesRealizadoVenda("#chtGrafDesRealizadoVendaLoja");
			$("#grafDesRealizadoLoja-view").bind("kendo:skinChange", function(e) {
				grafDesRealizadoVenda("#chtGrafDesRealizadoVendaLoja");
			});
		}, 100);
	};
    
	function GrafDesRealizadoTurnoShow() {     
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesRealizadoVenda("#chtGrafDesRealizadoVendaTurno");
			$("#grafDesRealizadoTurno-view").bind("kendo:skinChange", function(e) {
				grafDesRealizadoVenda("#chtGrafDesRealizadoVendaTurno");
			});
		}, 100);
	};

	/*Grafico Desempenho de Vendas Perdidas*/
	function GrafDesProdutividadeVendasPerdidasColShow() {    
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasCol");
			$("#grafDesProdutividadeVendasPerdidasCol-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasCol");
			});
		}, 100);
	};
    
	function GrafDesProdutividadeVendasPerdidasLojaShow() {   
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasLoja");
			$("#grafDesProdutividadeVendasPerdidasLoja-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasLoja");
			});
		}, 100);
	};
    
	function GrafDesProdutividadeVendasPerdidasTurnoShow() {     
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasTurno");
			$("#grafDesProdutividadeVendasPerdidasTurno-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeVendasPerdidas("#chtGrafDesProdutividadeVendasPerdidasTurno");
			});
		}, 100);
	};
  
	/*Grafico Desempenho de Vendas Perdidas*/
	function GrafDesProdutividadeAfastamentoColShow() {    
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoCol");
			$("#grafDesProdutividadeAfastamentoCol-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoCol");
			});
		}, 100);
	};
    
	function GrafDesProdutividadeAfastamentoLojaShow() {   
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoLoja");
			$("#grafDesProdutividadeAfastamentoLoja-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoLoja");
			});
		}, 100);
	};
    
	function GrafDesProdutividadeAfastamentoTurnoShow() {     
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoTurno");
			$("#grafDesProdutividadeAfastamentoTurno-view").bind("kendo:skinChange", function(e) {
				grafDesProdutividadeAfastamento("#chtGrafDesProdutividadeAfastamentoTurno");
			});
		}, 100);
	};
	
	/*Grafico Metas Diárias*/
	function GrafMetasDiariasColShow() {    
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafMetasDiarias("#chtGrafMetasDiariasCol");
			$("#GrafMetasDiariasCol-view").bind("kendo:skinChange", function(e) {
				grafMetasDiarias("#chtGrafMetasDiariasCol");
			});
		}, 100);
	};
    
	function GrafMetasDiariasLojaShow() {   
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafMetasDiarias("#chtGrafMetasDiariasLoja");
			$("#GrafMetasDiariasLoja-view").bind("kendo:skinChange", function(e) {
				grafMetasDiarias("#chtGrafMetasDiariasLoja");
			});
		}, 100);
	};
    
	function GrafMetasDiariasTurnoShow() {     
		setTimeout(function() {
			// Initialize the chart with a delay to make sure
			// the initial animation is visible
			grafMetasDiarias("#chtGrafMetasDiariasTurno");
			$("#GrafMetasDiariasTurno-view").bind("kendo:skinChange", function(e) {
				grafMetasDiarias("#chtGrafMetasDiariasTurno");
			});
		}, 100);
	};
    
	//Gráfico Desempenho de Vendas Realizado
	function grafDesRealizadoVenda(e) {
		$(e).kendoChart({
			theme: "metro",
			chartArea: {
				height: $(document).height() - 100
			},
			dataSource: dsDesRealizadoCol,
			title: {
				text: "Vendas - Realizado"
			},
			legend: {
				position: "bottom"
			},
			seriesDefaults: {
				type: "column"
			},
			series:[
				{
					//field: "MetaRealizadoAcumulado",
					field: "MetaRealizadoVlVenda",
					name: "Realizado Acumulado",
					color: "#2d8402"
				}
			],
			categoryAxis: {				
				field: "MetaHora",                
				labels: {
					template: "#= kendo.toString(value.substring(0, 5)) # ",					                  
					rotation: -90
				},
				majorGridLines: {
					visible: false
				}
			},
			valueAxis: {
				labels: {
					format: "R$ {0}",
					skip: 1,
					step: 1
				},
				line: {
					visible: true
				}
			},
			tooltip: {
				visible: true,
				template: "R$ #= kendo.format('{0:N2}', value) #",
				color: "#fff"                
			}
		});        
	}
  
	function grafDesProdutividadeVendasPerdidas(e) {
		$(e).kendoChart({            
			chartArea: {
				height: $(document).height() - 100,
				background: ""
			},	
			title: {
				position: "top",
				text: "Perdas de Vendas "
			},
			legend: {
				position: "bottom"
			},
			dataSource: dsProdutividadeVendasPerdidas,
			series: [
				{
					type: "pie",
					field: "Percentual",
					categoryField: "DescricaoMotivo",
					explodeField: "explode"
				}
			],
			tooltip: {
				visible: true,
				template: "${ category } - ${ value }%"
			}
            
		});        
	}
    
	function grafDesProdutividadeAfastamento(e) {
		$(e).kendoChart({            
			chartArea: {
				height: $(document).height() - 100,
				background: ""
			},	
			title: {
				position: "top",
				text: "Afastamentos Salão de Vendas"
			},
			legend: {
				position: "bottom"
			},
			dataSource: dsProdutividadeAfastamentos,
			series: [
				{
					type: "pie",
					field: "Percentual",
					categoryField: "DescricaoMotivo",
					explodeField: "explode"
				}
			],
			tooltip: {
				visible: true,
				template: "${ category } - ${ value }%"
			}
            
		});        
	}
    
	function grafMetasDiarias(e) {
		$(e).kendoChart({
			theme: "metro",
			chartArea: {
				height: $(document).height() - 100
			},
			dataSource: dsMetasDiarias,
			title: {
				text: "Previsto X Realizado"
			},
			legend: {
				position: "top"
			},
			seriesDefaults: {
				type: "column"
			},
			series:[
				{	
					field: "Previsto",
					name: "Previsto"
				},{
					field: "Realizado",
					name: "Realizado"
				}
			],
			categoryAxis: {				
				field: "Dia",                
				labels: {
					template: "#= kendo.toString(value, \"dd-MM-yyyy\") # ",					                  
					rotation: -90
				},
				majorGridLines: {
					visible: false
				}
			},
			valueAxis: {
				labels: {
					format: "R$ {0}",
					skip: 1,
					step: 1
				},
				line: {
					visible: true
				}
			},
			tooltip: {
				visible: true,
				template: "R$ #= kendo.format('{0:N2}', value) #",
				color: "#fff"                
			}
		});        
	}
	
	$.extend(window, {
		viewModelConsultas: viewModelConsultas,
		desRealizadoColShow: desRealizadoColShow,
		desRealizadoLojaShow: desRealizadoLojaShow,
		desRealizadoTurnoShow: desRealizadoTurnoShow,
        
		desProdutividadeVendasPerdidasColShow: desProdutividadeVendasPerdidasColShow,
		desProdutividadeVendasPerdidasLojaShow: desProdutividadeVendasPerdidasLojaShow,
		desProdutividadeVendasPerdidasTurnoShow: desProdutividadeVendasPerdidasTurnoShow,
        
		desProdutividadeAfastamentoColShow: desProdutividadeAfastamentoColShow,
		desProdutividadeAfastamentoLojaShow: desProdutividadeAfastamentoLojaShow,
		desProdutividadeAfastamentoTurnoShow: desProdutividadeAfastamentoTurnoShow,
        
		metasDiariasColShow:   metasDiariasColShow,
		metasDiariasLojaShow:  metasDiariasLojaShow,
		metasDiariasTurnoShow: metasDiariasTurnoShow,
		
        
		GrafDesRealizadoColShow: GrafDesRealizadoColShow,
		GrafDesRealizadoLojaShow: GrafDesRealizadoLojaShow,
		GrafDesRealizadoTurnoShow: GrafDesRealizadoTurnoShow,

		GrafDesProdutividadeVendasPerdidasColShow: GrafDesProdutividadeVendasPerdidasColShow,
		GrafDesProdutividadeVendasPerdidasLojaShow: GrafDesProdutividadeVendasPerdidasLojaShow,
		GrafDesProdutividadeVendasPerdidasTurnoShow: GrafDesProdutividadeVendasPerdidasTurnoShow,
        
		GrafDesProdutividadeAfastamentoColShow: GrafDesProdutividadeAfastamentoColShow,
		GrafDesProdutividadeAfastamentoLojaShow: GrafDesProdutividadeAfastamentoLojaShow,
		GrafDesProdutividadeAfastamentoTurnoShow: GrafDesProdutividadeAfastamentoTurnoShow,	
		
		GrafMetasDiariasColShow: GrafMetasDiariasColShow,
		GrafMetasDiariasLojaShow: GrafMetasDiariasLojaShow,
		GrafMetasDiariasTurnoShow: GrafMetasDiariasTurnoShow
        
	});
})(jQuery);