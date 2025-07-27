// Database informazioni fiscali territoriali italiane

export interface RegioneFiscale {
  codice: string;
  nome: string;
  addizionaleRegionale: {
    aliquotaBase: number; // %
    aliquotaMax: number; // %
    sogliaNonImponibile?: number; // soglia sotto cui non si applica
  };
  irap: {
    aliquotaBase: number; // %
    aliquoteSettoriali?: Record<string, number>; // aliquote specifiche per settore
  };
  province: ProvinciaFiscale[];
}

export interface ProvinciaFiscale {
  codice: string;
  nome: string;
  regione: string;
  addizionaleComunaleMedia: number; // % media dei comuni
  comuniPrincipali: ComuneFiscale[];
}

export interface ComuneFiscale {
  nome: string;
  codiceIstat: string;
  addizionaleComunale: number; // %
  aliquotaIMU?: number; // % per immobili strumentali
  tassaRifiuti?: {
    categorieNonDomestiche: Record<string, number>; // €/mq per categoria
  };
}

// Database completo regioni italiane con dati fiscali 2024
export const regioniFiscali: RegioneFiscale[] = [
  {
    codice: "01",
    nome: "Piemonte",
    addizionaleRegionale: {
      aliquotaBase: 1.68,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9,
      aliquoteSettoriali: {
        "banche": 4.65,
        "assicurazioni": 5.9,
        "attivita_finanziarie": 4.25
      }
    },
    province: [
      {
        codice: "001",
        nome: "Torino",
        regione: "Piemonte",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Torino",
            codiceIstat: "001272",
            addizionaleComunale: 0.8,
            aliquotaIMU: 0.86,
            tassaRifiuti: {
              categorieNonDomestiche: {
                "uffici": 12.50,
                "negozi": 18.75,
                "ristoranti": 25.30,
                "industrie": 8.40
              }
            }
          },
          {
            nome: "Moncalieri",
            codiceIstat: "001158",
            addizionaleComunale: 0.7
          },
          {
            nome: "Collegno",
            codiceIstat: "001075",
            addizionaleComunale: 0.6
          },
          {
            nome: "Rivoli",
            codiceIstat: "001208",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "002",
        nome: "Cuneo",
        regione: "Piemonte", 
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Cuneo",
            codiceIstat: "004078",
            addizionaleComunale: 0.6
          },
          {
            nome: "Alba",
            codiceIstat: "004003",
            addizionaleComunale: 0.7
          },
          {
            nome: "Bra",
            codiceIstat: "004026",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "003",
        nome: "Novara",
        regione: "Piemonte",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Novara",
            codiceIstat: "003106",
            addizionaleComunale: 0.8
          },
          {
            nome: "Borgomanero",
            codiceIstat: "003018",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "004",
        nome: "Alessandria",
        regione: "Piemonte",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Alessandria",
            codiceIstat: "006002",
            addizionaleComunale: 0.7
          },
          {
            nome: "Casale Monferrato",
            codiceIstat: "006043",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "02",
    nome: "Valle d'Aosta",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "007",
        nome: "Aosta",
        regione: "Valle d'Aosta",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Aosta",
            codiceIstat: "007003",
            addizionaleComunale: 0.5
          },
          {
            nome: "Courmayeur",
            codiceIstat: "007022",
            addizionaleComunale: 0.3
          },
          {
            nome: "Saint-Vincent",
            codiceIstat: "007061",
            addizionaleComunale: 0.4
          }
        ]
      }
    ]
  },
  {
    codice: "03",
    nome: "Lombardia",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9,
      aliquoteSettoriali: {
        "banche": 4.65,
        "assicurazioni": 5.9
      }
    },
    province: [
      {
        codice: "015",
        nome: "Milano",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Milano",
            codiceIstat: "015146",
            addizionaleComunale: 0.9,
            aliquotaIMU: 0.96,
            tassaRifiuti: {
              categorieNonDomestiche: {
                "uffici": 15.20,
                "negozi": 22.30,
                "ristoranti": 28.90,
                "industrie": 9.80
              }
            }
          },
          {
            nome: "Sesto San Giovanni",
            codiceIstat: "015190",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cinisello Balsamo",
            codiceIstat: "015078",
            addizionaleComunale: 0.8
          },
          {
            nome: "Rho",
            codiceIstat: "015173",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "016",
        nome: "Bergamo",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Bergamo",
            codiceIstat: "016024",
            addizionaleComunale: 0.8
          },
          {
            nome: "Treviglio",
            codiceIstat: "016219",
            addizionaleComunale: 0.7
          },
          {
            nome: "Seriate",
            codiceIstat: "016187",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "017",
        nome: "Brescia",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Brescia",
            codiceIstat: "017029",
            addizionaleComunale: 0.8
          },
          {
            nome: "Desenzano del Garda",
            codiceIstat: "017067",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "012",
        nome: "Varese",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Varese",
            codiceIstat: "012133",
            addizionaleComunale: 0.7
          },
          {
            nome: "Busto Arsizio",
            codiceIstat: "012023",
            addizionaleComunale: 0.8
          },
          {
            nome: "Gallarate",
            codiceIstat: "012071",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "013",
        nome: "Como",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Como",
            codiceIstat: "013075",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cantù",
            codiceIstat: "013041",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "020",
        nome: "Monza e Brianza",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Monza",
            codiceIstat: "108033",
            addizionaleComunale: 0.8
          },
          {
            nome: "Desio",
            codiceIstat: "108013",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "014",
        nome: "Cremona",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Cremona",
            codiceIstat: "019030",
            addizionaleComunale: 0.7
          },
          {
            nome: "Crema",
            codiceIstat: "019029",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "018",
        nome: "Mantova",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Mantova",
            codiceIstat: "020030",
            addizionaleComunale: 0.7
          },
          {
            nome: "Castiglione delle Stiviere",
            codiceIstat: "020011",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "019",
        nome: "Pavia",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Pavia",
            codiceIstat: "018110",
            addizionaleComunale: 0.8
          },
          {
            nome: "Vigevano",
            codiceIstat: "018175",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "097",
        nome: "Lecco",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Lecco",
            codiceIstat: "097042",
            addizionaleComunale: 0.7
          },
          {
            nome: "Merate",
            codiceIstat: "097050",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "098",
        nome: "Lodi",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Lodi",
            codiceIstat: "098023",
            addizionaleComunale: 0.7
          },
          {
            nome: "Codogno",
            codiceIstat: "098015",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "099",
        nome: "Sondrio",
        regione: "Lombardia",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Sondrio",
            codiceIstat: "014061",
            addizionaleComunale: 0.6
          },
          {
            nome: "Tirano",
            codiceIstat: "014067",
            addizionaleComunale: 0.5
          }
        ]
      }
    ]
  },
  {
    codice: "04",
    nome: "Trentino-Alto Adige",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 2.68 // Aliquota ridotta per autonomia speciale
    },
    province: [
      {
        codice: "021",
        nome: "Bolzano",
        regione: "Trentino-Alto Adige",
        addizionaleComunaleMedia: 0.3,
        comuniPrincipali: [
          {
            nome: "Bolzano",
            codiceIstat: "021008",
            addizionaleComunale: 0.5
          },
          {
            nome: "Merano",
            codiceIstat: "021051",
            addizionaleComunale: 0.4
          },
          {
            nome: "Bressanone",
            codiceIstat: "021014",
            addizionaleComunale: 0.3
          }
        ]
      },
      {
        codice: "022",
        nome: "Trento",
        regione: "Trentino-Alto Adige",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Trento",
            codiceIstat: "022205",
            addizionaleComunale: 0.6
          },
          {
            nome: "Rovereto",
            codiceIstat: "022165",
            addizionaleComunale: 0.5
          },
          {
            nome: "Pergine Valsugana",
            codiceIstat: "022138",
            addizionaleComunale: 0.4
          }
        ]
      }
    ]
  },
  {
    codice: "05",
    nome: "Veneto",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "027",
        nome: "Venezia",
        regione: "Veneto",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Venezia",
            codiceIstat: "027042",
            addizionaleComunale: 0.7,
            aliquotaIMU: 0.86
          },
          {
            nome: "Mestre",
            codiceIstat: "027042",
            addizionaleComunale: 0.7
          },
          {
            nome: "Chioggia",
            codiceIstat: "027010",
            addizionaleComunale: 0.6
          },
          {
            nome: "San Donà di Piave",
            codiceIstat: "027027",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "028",
        nome: "Verona",
        regione: "Veneto",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Verona",
            codiceIstat: "023091",
            addizionaleComunale: 0.8
          },
          {
            nome: "Legnago",
            codiceIstat: "023042",
            addizionaleComunale: 0.6
          },
          {
            nome: "San Bonifacio",
            codiceIstat: "023071",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "026",
        nome: "Vicenza",
        regione: "Veneto",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Vicenza",
            codiceIstat: "024116",
            addizionaleComunale: 0.8
          },
          {
            nome: "Bassano del Grappa",
            codiceIstat: "024009",
            addizionaleComunale: 0.7
          },
          {
            nome: "Schio",
            codiceIstat: "024080",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "025",
        nome: "Treviso",
        regione: "Veneto",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Treviso",
            codiceIstat: "026086",
            addizionaleComunale: 0.7
          },
          {
            nome: "Conegliano",
            codiceIstat: "026022",
            addizionaleComunale: 0.6
          },
          {
            nome: "Castelfranco Veneto",
            codiceIstat: "026014",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "029",
        nome: "Padova",
        regione: "Veneto",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Padova",
            codiceIstat: "028060",
            addizionaleComunale: 0.8
          },
          {
            nome: "Abano Terme",
            codiceIstat: "028001",
            addizionaleComunale: 0.7
          },
          {
            nome: "Cittadella",
            codiceIstat: "028026",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "06",
    nome: "Friuli-Venezia Giulia",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 2.68 // Aliquota ridotta per autonomia speciale
    },
    province: [
      {
        codice: "030",
        nome: "Trieste",
        regione: "Friuli-Venezia Giulia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Trieste",
            codiceIstat: "032006",
            addizionaleComunale: 0.8
          },
          {
            nome: "Muggia",
            codiceIstat: "032004",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "031",
        nome: "Udine",
        regione: "Friuli-Venezia Giulia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Udine",
            codiceIstat: "030129",
            addizionaleComunale: 0.7
          },
          {
            nome: "Codroipo",
            codiceIstat: "030023",
            addizionaleComunale: 0.6
          },
          {
            nome: "Cividale del Friuli",
            codiceIstat: "030021",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "093",
        nome: "Pordenone",
        regione: "Friuli-Venezia Giulia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Pordenone",
            codiceIstat: "093033",
            addizionaleComunale: 0.7
          },
          {
            nome: "Sacile",
            codiceIstat: "093041",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "031",
        nome: "Gorizia",
        regione: "Friuli-Venezia Giulia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Gorizia",
            codiceIstat: "031007",
            addizionaleComunale: 0.7
          },
          {
            nome: "Monfalcone",
            codiceIstat: "031013",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "07",
    nome: "Liguria",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.17 // Liguria ha aliquota IRAP maggiorata
    },
    province: [
      {
        codice: "010",
        nome: "Genova",
        regione: "Liguria",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Genova",
            codiceIstat: "010025",
            addizionaleComunale: 0.8,
            aliquotaIMU: 0.96
          },
          {
            nome: "Rapallo",
            codiceIstat: "010046",
            addizionaleComunale: 0.7
          },
          {
            nome: "Chiavari",
            codiceIstat: "010015",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "011",
        nome: "Savona",
        regione: "Liguria",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Savona",
            codiceIstat: "009057",
            addizionaleComunale: 0.7
          },
          {
            nome: "Albenga",
            codiceIstat: "009002",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "008",
        nome: "Imperia",
        regione: "Liguria",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Imperia",
            codiceIstat: "008031",
            addizionaleComunale: 0.6
          },
          {
            nome: "Sanremo",
            codiceIstat: "008055",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "011",
        nome: "La Spezia",
        regione: "Liguria",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "La Spezia",
            codiceIstat: "011015",
            addizionaleComunale: 0.8
          },
          {
            nome: "Sarzana",
            codiceIstat: "011027",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "08",
    nome: "Emilia-Romagna",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "037",
        nome: "Bologna",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Bologna",
            codiceIstat: "037006",
            addizionaleComunale: 0.8,
            aliquotaIMU: 0.96
          },
          {
            nome: "Imola",
            codiceIstat: "037027",
            addizionaleComunale: 0.7
          },
          {
            nome: "Casalecchio di Reno",
            codiceIstat: "037011",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "038",
        nome: "Ferrara", 
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Ferrara",
            codiceIstat: "038008",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cento",
            codiceIstat: "038005",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "036",
        nome: "Modena",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Modena",
            codiceIstat: "036023",
            addizionaleComunale: 0.8
          },
          {
            nome: "Carpi",
            codiceIstat: "036006",
            addizionaleComunale: 0.7
          },
          {
            nome: "Sassuolo",
            codiceIstat: "036037",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "035",
        nome: "Reggio Emilia",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Reggio nell'Emilia",
            codiceIstat: "035033",
            addizionaleComunale: 0.8
          },
          {
            nome: "Scandiano",
            codiceIstat: "035040",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "034",
        nome: "Parma",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Parma",
            codiceIstat: "034027",
            addizionaleComunale: 0.8
          },
          {
            nome: "Fidenza",
            codiceIstat: "034017",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "033",
        nome: "Piacenza",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Piacenza",
            codiceIstat: "033032",
            addizionaleComunale: 0.8
          },
          {
            nome: "Fiorenzuola d'Arda",
            codiceIstat: "033018",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "039",
        nome: "Forlì-Cesena",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Forlì",
            codiceIstat: "040014",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cesena",
            codiceIstat: "040007",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "040",
        nome: "Ravenna",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Ravenna",
            codiceIstat: "039014",
            addizionaleComunale: 0.8
          },
          {
            nome: "Faenza",
            codiceIstat: "039013",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "099",
        nome: "Rimini",
        regione: "Emilia-Romagna",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Rimini",
            codiceIstat: "099014",
            addizionaleComunale: 0.9
          },
          {
            nome: "Riccione",
            codiceIstat: "099013",
            addizionaleComunale: 0.8
          }
        ]
      }
    ]
  },
  {
    codice: "09",
    nome: "Toscana",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "048",
        nome: "Firenze",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Firenze",
            codiceIstat: "048017",
            addizionaleComunale: 0.8,
            aliquotaIMU: 1.06
          },
          {
            nome: "Prato",
            codiceIstat: "100005",
            addizionaleComunale: 0.7
          },
          {
            nome: "Empoli",
            codiceIstat: "048013",
            addizionaleComunale: 0.6
          },
          {
            nome: "Scandicci",
            codiceIstat: "048038",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "052",
        nome: "Pisa",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Pisa",
            codiceIstat: "050026",
            addizionaleComunale: 0.8
          },
          {
            nome: "Pontedera",
            codiceIstat: "050027",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "053",
        nome: "Siena",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Siena",
            codiceIstat: "052032",
            addizionaleComunale: 0.7
          },
          {
            nome: "Poggibonsi",
            codiceIstat: "052024",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "049",
        nome: "Lucca",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Lucca",
            codiceIstat: "046017",
            addizionaleComunale: 0.8
          },
          {
            nome: "Viareggio",
            codiceIstat: "046033",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "050",
        nome: "Livorno",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Livorno",
            codiceIstat: "049009",
            addizionaleComunale: 0.8
          },
          {
            nome: "Piombino",
            codiceIstat: "049016",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "051",
        nome: "Arezzo",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Arezzo",
            codiceIstat: "051002",
            addizionaleComunale: 0.7
          },
          {
            nome: "Cortona",
            codiceIstat: "051017",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "047",
        nome: "Massa-Carrara",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Massa",
            codiceIstat: "045005",
            addizionaleComunale: 0.8
          },
          {
            nome: "Carrara",
            codiceIstat: "045002",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "054",
        nome: "Pistoia",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Pistoia",
            codiceIstat: "047021",
            addizionaleComunale: 0.8
          },
          {
            nome: "Montecatini Terme",
            codiceIstat: "047014",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "053",
        nome: "Grosseto",
        regione: "Toscana",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Grosseto",
            codiceIstat: "053011",
            addizionaleComunale: 0.7
          },
          {
            nome: "Follonica",
            codiceIstat: "053009",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "10",
    nome: "Umbria",
    addizionaleRegionale: {
      aliquotaBase: 1.4,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "054",
        nome: "Perugia",
        regione: "Umbria",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Perugia",
            codiceIstat: "054039",
            addizionaleComunale: 0.8
          },
          {
            nome: "Foligno",
            codiceIstat: "054018",
            addizionaleComunale: 0.7
          },
          {
            nome: "Città di Castello",
            codiceIstat: "054009",
            addizionaleComunale: 0.6
          },
          {
            nome: "Assisi",
            codiceIstat: "054001",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "055",
        nome: "Terni",
        regione: "Umbria",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Terni",
            codiceIstat: "055032",
            addizionaleComunale: 0.8
          },
          {
            nome: "Orvieto",
            codiceIstat: "055023",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "11",
    nome: "Marche",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.2
    },
    province: [
      {
        codice: "042",
        nome: "Ancona",
        regione: "Marche",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Ancona",
            codiceIstat: "042002",
            addizionaleComunale: 0.8
          },
          {
            nome: "Senigallia",
            codiceIstat: "042045",
            addizionaleComunale: 0.6
          },
          {
            nome: "Jesi",
            codiceIstat: "042024",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "044",
        nome: "Ascoli Piceno",
        regione: "Marche",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Ascoli Piceno",
            codiceIstat: "044007",
            addizionaleComunale: 0.7
          },
          {
            nome: "San Benedetto del Tronto",
            codiceIstat: "044074",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "12",
    nome: "Lazio",
    addizionaleRegionale: {
      aliquotaBase: 3.33, // Lazio ha aliquota massima
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.82 // Lazio ha aliquota IRAP tra le più alte
    },
    province: [
      {
        codice: "058",
        nome: "Roma",
        regione: "Lazio",
        addizionaleComunaleMedia: 0.8,
        comuniPrincipali: [
          {
            nome: "Roma",
            codiceIstat: "058091",
            addizionaleComunale: 0.9,
            aliquotaIMU: 0.86,
            tassaRifiuti: {
              categorieNonDomestiche: {
                "uffici": 14.80,
                "negozi": 21.90,
                "ristoranti": 27.50,
                "industrie": 10.20
              }
            }
          },
          {
            nome: "Tivoli",
            codiceIstat: "058111",
            addizionaleComunale: 0.8
          },
          {
            nome: "Guidonia Montecelio",
            codiceIstat: "058048",
            addizionaleComunale: 0.7
          },
          {
            nome: "Fiumicino",
            codiceIstat: "058033",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "059",
        nome: "Latina",
        regione: "Lazio",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Latina",
            codiceIstat: "059011",
            addizionaleComunale: 0.8
          },
          {
            nome: "Aprilia",
            codiceIstat: "059002",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "057",
        nome: "Frosinone",
        regione: "Lazio",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Frosinone",
            codiceIstat: "060037",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cassino",
            codiceIstat: "060022",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "13",
    nome: "Abruzzo",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "066",
        nome: "L'Aquila",
        regione: "Abruzzo",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "L'Aquila",
            codiceIstat: "066049",
            addizionaleComunale: 0.7
          },
          {
            nome: "Avezzano",
            codiceIstat: "066006",
            addizionaleComunale: 0.6
          },
          {
            nome: "Sulmona",
            codiceIstat: "066097",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "067",
        nome: "Teramo",
        regione: "Abruzzo",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Teramo",
            codiceIstat: "067035",
            addizionaleComunale: 0.8
          },
          {
            nome: "Giulianova",
            codiceIstat: "067021",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "068",
        nome: "Pescara",
        regione: "Abruzzo",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Pescara",
            codiceIstat: "068028",
            addizionaleComunale: 0.8
          },
          {
            nome: "Montesilvano",
            codiceIstat: "068027",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "069",
        nome: "Chieti",
        regione: "Abruzzo",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Chieti",
            codiceIstat: "069022",
            addizionaleComunale: 0.7
          },
          {
            nome: "Vasto",
            codiceIstat: "069097",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "14",
    nome: "Molise",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "070",
        nome: "Campobasso",
        regione: "Molise",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Campobasso",
            codiceIstat: "070009",
            addizionaleComunale: 0.7
          },
          {
            nome: "Termoli",
            codiceIstat: "070078",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "094",
        nome: "Isernia",
        regione: "Molise",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Isernia",
            codiceIstat: "094003",
            addizionaleComunale: 0.6
          },
          {
            nome: "Venafro",
            codiceIstat: "094014",
            addizionaleComunale: 0.5
          }
        ]
      }
    ]
  },
  {
    codice: "15",
    nome: "Campania",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.82 // Campania ha aliquota IRAP maggiorata
    },
    province: [
      {
        codice: "063",
        nome: "Napoli",
        regione: "Campania",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Napoli",
            codiceIstat: "063049",
            addizionaleComunale: 0.8,
            aliquotaIMU: 1.06
          },
          {
            nome: "Pozzuoli",
            codiceIstat: "063060",
            addizionaleComunale: 0.7
          },
          {
            nome: "Torre del Greco",
            codiceIstat: "063085",
            addizionaleComunale: 0.8
          },
          {
            nome: "Giugliano in Campania",
            codiceIstat: "063036",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "061",
        nome: "Caserta",
        regione: "Campania",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Caserta",
            codiceIstat: "061022",
            addizionaleComunale: 0.8
          },
          {
            nome: "Aversa",
            codiceIstat: "061007",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "062",
        nome: "Salerno",
        regione: "Campania",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Salerno",
            codiceIstat: "065116",
            addizionaleComunale: 0.8
          },
          {
            nome: "Battipaglia",
            codiceIstat: "065011",
            addizionaleComunale: 0.7
          },
          {
            nome: "Cava de' Tirreni",
            codiceIstat: "065024",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "064",
        nome: "Avellino",
        regione: "Campania",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Avellino",
            codiceIstat: "064007",
            addizionaleComunale: 0.7
          },
          {
            nome: "Ariano Irpino",
            codiceIstat: "064004",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "062",
        nome: "Benevento",
        regione: "Campania",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Benevento",
            codiceIstat: "062008",
            addizionaleComunale: 0.7
          },
          {
            nome: "Telese Terme",
            codiceIstat: "062069",
            addizionaleComunale: 0.5
          }
        ]
      }
    ]
  },
  {
    codice: "16",
    nome: "Puglia",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.82
    },
    province: [
      {
        codice: "072",
        nome: "Bari",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Bari",
            codiceIstat: "072006",
            addizionaleComunale: 0.8
          },
          {
            nome: "Altamura",
            codiceIstat: "072003",
            addizionaleComunale: 0.7
          },
          {
            nome: "Molfetta",
            codiceIstat: "072025",
            addizionaleComunale: 0.6
          },
          {
            nome: "Bitonto",
            codiceIstat: "072008",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "075",
        nome: "Lecce",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Lecce",
            codiceIstat: "075035",
            addizionaleComunale: 0.8
          },
          {
            nome: "Gallipoli",
            codiceIstat: "075028",
            addizionaleComunale: 0.6
          },
          {
            nome: "Nardò",
            codiceIstat: "075050",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "071",
        nome: "Foggia",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Foggia",
            codiceIstat: "071024",
            addizionaleComunale: 0.8
          },
          {
            nome: "Cerignola",
            codiceIstat: "071015",
            addizionaleComunale: 0.7
          },
          {
            nome: "San Severo",
            codiceIstat: "071052",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "073",
        nome: "Taranto",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Taranto",
            codiceIstat: "073027",
            addizionaleComunale: 0.8
          },
          {
            nome: "Massafra",
            codiceIstat: "073013",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "074",
        nome: "Brindisi",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Brindisi",
            codiceIstat: "074001",
            addizionaleComunale: 0.8
          },
          {
            nome: "Francavilla Fontana",
            codiceIstat: "074007",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "110",
        nome: "Barletta-Andria-Trani",
        regione: "Puglia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Barletta",
            codiceIstat: "110001",
            addizionaleComunale: 0.8
          },
          {
            nome: "Andria",
            codiceIstat: "110002",
            addizionaleComunale: 0.7
          },
          {
            nome: "Trani",
            codiceIstat: "110003",
            addizionaleComunale: 0.7
          }
        ]
      }
    ]
  },
  {
    codice: "17",
    nome: "Basilicata",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 3.9
    },
    province: [
      {
        codice: "076",
        nome: "Potenza",
        regione: "Basilicata",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Potenza",
            codiceIstat: "076063",
            addizionaleComunale: 0.7
          },
          {
            nome: "Melfi",
            codiceIstat: "076048",
            addizionaleComunale: 0.6
          },
          {
            nome: "Lavello",
            codiceIstat: "076041",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "077",
        nome: "Matera",
        regione: "Basilicata",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Matera",
            codiceIstat: "077014",
            addizionaleComunale: 0.8
          },
          {
            nome: "Policoro",
            codiceIstat: "077023",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "18",
    nome: "Calabria",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.82
    },
    province: [
      {
        codice: "078",
        nome: "Cosenza",
        regione: "Calabria",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Cosenza",
            codiceIstat: "078045",
            addizionaleComunale: 0.7
          },
          {
            nome: "Rende",
            codiceIstat: "078103",
            addizionaleComunale: 0.6
          },
          {
            nome: "Rossano",
            codiceIstat: "078124",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "079",
        nome: "Catanzaro",
        regione: "Calabria",
        addizionaleComunaleMedia: 0.7,
        comuniPrincipali: [
          {
            nome: "Catanzaro",
            codiceIstat: "079023",
            addizionaleComunale: 0.8
          },
          {
            nome: "Lamezia Terme",
            codiceIstat: "079053",
            addizionaleComunale: 0.7
          }
        ]
      },
      {
        codice: "080",
        nome: "Reggio Calabria",
        regione: "Calabria",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Reggio Calabria",
            codiceIstat: "080063",
            addizionaleComunale: 0.8
          },
          {
            nome: "Villa San Giovanni",
            codiceIstat: "080091",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "101",
        nome: "Crotone",
        regione: "Calabria",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Crotone",
            codiceIstat: "101006",
            addizionaleComunale: 0.7
          },
          {
            nome: "Cirò Marina",
            codiceIstat: "101004",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "102",
        nome: "Vibo Valentia",
        regione: "Calabria",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Vibo Valentia",
            codiceIstat: "102043",
            addizionaleComunale: 0.6
          },
          {
            nome: "Tropea",
            codiceIstat: "102040",
            addizionaleComunale: 0.5
          }
        ]
      }
    ]
  },
  {
    codice: "19",
    nome: "Sicilia",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 4.82
    },
    province: [
      {
        codice: "082",
        nome: "Palermo",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Palermo",
            codiceIstat: "082053",
            addizionaleComunale: 0.8
          },
          {
            nome: "Bagheria",
            codiceIstat: "082006",
            addizionaleComunale: 0.7
          },
          {
            nome: "Carini",
            codiceIstat: "082015",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "087",
        nome: "Catania",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Catania",
            codiceIstat: "087015",
            addizionaleComunale: 0.7
          },
          {
            nome: "Acireale",
            codiceIstat: "087002",
            addizionaleComunale: 0.6
          },
          {
            nome: "Misterbianco",
            codiceIstat: "087031",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "081",
        nome: "Messina",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Messina",
            codiceIstat: "083048",
            addizionaleComunale: 0.8
          },
          {
            nome: "Milazzo",
            codiceIstat: "083050",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "084",
        nome: "Agrigento",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Agrigento",
            codiceIstat: "084001",
            addizionaleComunale: 0.7
          },
          {
            nome: "Sciacca",
            codiceIstat: "084033",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "085",
        nome: "Siracusa",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Siracusa",
            codiceIstat: "089017",
            addizionaleComunale: 0.8
          },
          {
            nome: "Augusta",
            codiceIstat: "089003",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "086",
        nome: "Ragusa",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Ragusa",
            codiceIstat: "088008",
            addizionaleComunale: 0.7
          },
          {
            nome: "Vittoria",
            codiceIstat: "088014",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "088",
        nome: "Caltanissetta",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Caltanissetta",
            codiceIstat: "085006",
            addizionaleComunale: 0.7
          },
          {
            nome: "Gela",
            codiceIstat: "085007",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "083",
        nome: "Enna",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Enna",
            codiceIstat: "086009",
            addizionaleComunale: 0.6
          },
          {
            nome: "Piazza Armerina",
            codiceIstat: "086013",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "089",
        nome: "Trapani",
        regione: "Sicilia",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Trapani",
            codiceIstat: "081021",
            addizionaleComunale: 0.7
          },
          {
            nome: "Marsala",
            codiceIstat: "081011",
            addizionaleComunale: 0.6
          }
        ]
      }
    ]
  },
  {
    codice: "20",
    nome: "Sardegna",
    addizionaleRegionale: {
      aliquotaBase: 1.23,
      aliquotaMax: 3.33,
      sogliaNonImponibile: 15000
    },
    irap: {
      aliquotaBase: 2.68 // Aliquota ridotta per autonomia speciale
    },
    province: [
      {
        codice: "092",
        nome: "Cagliari",
        regione: "Sardegna",
        addizionaleComunaleMedia: 0.6,
        comuniPrincipali: [
          {
            nome: "Cagliari",
            codiceIstat: "092009",
            addizionaleComunale: 0.8
          },
          {
            nome: "Quartu Sant'Elena",
            codiceIstat: "092051",
            addizionaleComunale: 0.7
          },
          {
            nome: "Selargius",
            codiceIstat: "092058",
            addizionaleComunale: 0.6
          }
        ]
      },
      {
        codice: "090",
        nome: "Sassari",
        regione: "Sardegna",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Sassari",
            codiceIstat: "090064",
            addizionaleComunale: 0.7
          },
          {
            nome: "Alghero",
            codiceIstat: "090003",
            addizionaleComunale: 0.6
          },
          {
            nome: "Porto Torres",
            codiceIstat: "090056",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "091",
        nome: "Nuoro",
        regione: "Sardegna",
        addizionaleComunaleMedia: 0.4,
        comuniPrincipali: [
          {
            nome: "Nuoro",
            codiceIstat: "091040",
            addizionaleComunale: 0.6
          },
          {
            nome: "Siniscola",
            codiceIstat: "091067",
            addizionaleComunale: 0.5
          }
        ]
      },
      {
        codice: "107",
        nome: "Oristano",
        regione: "Sardegna",
        addizionaleComunaleMedia: 0.5,
        comuniPrincipali: [
          {
            nome: "Oristano",
            codiceIstat: "09563",
            addizionaleComunale: 0.7
          },
          {
            nome: "Cabras",
            codiceIstat: "095010",
            addizionaleComunale: 0.5
          }
        ]
      }
    ]
  }
];

// Utility functions
export function trovaRegionePerNome(nome: string): RegioneFiscale | undefined {
  return regioniFiscali.find(r => r.nome.toLowerCase().includes(nome.toLowerCase()));
}

export function trovaProvinciaPerNome(nome: string): ProvinciaFiscale | undefined {
  for (const regione of regioniFiscali) {
    const provincia = regione.province.find(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
    if (provincia) return provincia;
  }
  return undefined;
}

export function trovaComunePerNome(nome: string): { comune: ComuneFiscale; provincia: ProvinciaFiscale; regione: RegioneFiscale } | undefined {
  for (const regione of regioniFiscali) {
    for (const provincia of regione.province) {
      const comune = provincia.comuniPrincipali.find(c => c.nome.toLowerCase().includes(nome.toLowerCase()));
      if (comune) {
        return { comune, provincia, regione };
      }
    }
  }
  return undefined;
}

export function calcolaAddizionaliTerritoriali(
  imponibile: number,
  regione: RegioneFiscale,
  comune?: ComuneFiscale
) {
  // Addizionale regionale
  let addizionaleRegionale = 0;
  if (imponibile > (regione.addizionaleRegionale.sogliaNonImponibile || 0)) {
    addizionaleRegionale = imponibile * (regione.addizionaleRegionale.aliquotaBase / 100);
  }

  // Addizionale comunale
  let addizionaleComunale = 0;
  if (comune) {
    addizionaleComunale = imponibile * (comune.addizionaleComunale / 100);
  }

  return {
    addizionaleRegionale,
    addizionaleComunale,
    totale: addizionaleRegionale + addizionaleComunale
  };
}

export function calcolaIRAP(
  valoreProduzioneNetto: number,
  regione: RegioneFiscale,
  settore?: string
): number {
  let aliquota = regione.irap.aliquotaBase;
  
  // Applica aliquota settoriale se disponibile
  if (settore && regione.irap.aliquoteSettoriali?.[settore]) {
    aliquota = regione.irap.aliquoteSettoriali[settore];
  }
  
  return valoreProduzioneNetto * (aliquota / 100);
}

// Mappatura codici ATECO a settori per IRAP
export const mappingATECOSettori: Record<string, string> = {
  "64": "banche",
  "65": "assicurazioni", 
  "66": "attivita_finanziarie",
  "K64": "banche",
  "K65": "assicurazioni",
  "K66": "attivita_finanziarie"
};

export function getSSettorePerATECO(codiceATECO: string): string | undefined {
  // Controlla prima i codici esatti
  if (mappingATECOSettori[codiceATECO]) {
    return mappingATECOSettori[codiceATECO];
  }
  
  // Poi controlla i prefissi (primi 2 caratteri)
  const prefisso = codiceATECO.substring(0, 2);
  return mappingATECOSettori[prefisso];
} 