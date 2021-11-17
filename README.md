### START DO PROJETO 

**Instalar as dependências do projeto**
```sh 
npm install
```

**Criar o arquivo das variáveis de ambiente**
```sh
cp .env.example .env
```

**Observações:**
- O arquivo `.env` pode ser criado manualmente;
- Necessário preencher o arquivo `.env` criado anteriormente com todas as variáveis de ambiente, conforme definidas no arquivo `.env.example`;

**Iniciar o servidor em modo de desenvolvimento**
```sh 
node ace serve --watch
```

O projeto iniciará localmente na porta 3333

Caso necessário, a porta pode ser trocada no arquivo `.env`

### COLLECTION DO POSTMAN

Para facilitar os testes da API, aqui está o link para acessar as request via POSTMAN https://www.getpostman.com/collections/18085150400d174d2f1a

### REQUISIÇÕES

Informações necessárias no cabeçalho das requisições:
* Content-Type: application/json
* Accept: application/json


### RETORNO DE ERROS

Caso algo não ocorra como o esperado, existe o retorno padrão da api.

```json
{
  "error": {
    "message": "Informe a propriedade userId",
    "name": "PropertyRequired",
    "status": 400
  }
}
```

### ROTAS

### /rules

**GET /rules:** Busca todas as regras cadastradas

* Sem parâmetros

**Response:**
```json
[
  {
    "id": "4ae31736-7d35-4372-9529-89cc28e07380",
    "dateStart": "2021-01-01T00:00:00.000-03:00",
    "dateEnd": "2021-01-15T00:00:00.000-03:00",
    "intervals": [
      {
        "start": "08:30",
        "end": "09:30"
      }
    ],
    "daysOfWeek": [
      1,
      2,
      4
    ]
  },
  ...
]
```

**POST /rules**: Cadastra uma nova regra.

* dateStart: String (Deve estar no padrão DD-MM-YYYY)
* dateEnd: String (Deve estar no padrão DD-MM-YYYY)
* intervals: Array
* daysOfWeek: Array (Representando os dias da semana. Começando em 1 - Segunda até 7 - Domingo.)

**Request:**
```json
{
  "dateStart": "01-01-2021",
  "dateEnd": "15-01-2021",
  "intervals": [
	  {
		  "start": "08:30", 
		  "end": "09:30"
	  }
  ],
  "daysOfWeek": [1,2,4]
}
```

**Response:**
```json
{
  "id": "6b01dd23-dff3-43f7-a6f1-e63dc3f86a99",
  "dateStart": "2021-01-01T00:00:00.000-03:00",
  "dateEnd": "2021-01-15T00:00:00.000-03:00",
  "intervals": [
    {
      "start": "08:30",
      "end": "09:30"
    }
  ],
  "daysOfWeek": [1,2,4]
}
```

**DELETE /rules/:id**: Executa a deleção da regra de acordo com o ID informado.

* Sem parâmetros

**Response:**
```json
{
  true
}
```

### /appointments

**GET /appointments/:dateStart/:dateEnd** Busca todos os horários disponíveis de acordo com as regras cadastradas e o período informado na request.

* dateStart: String (Deve estar no padrão DD-MM-YYYY)
* dateEnd: String (Deve estar no padrão DD-MM-YYYY)

**Response:**
```json
[
  {
    "day": "04-01-2021",
    "intervals": [
      {
        "start": "08:30",
        "end": "09:30"
      }
    ]
  },
  ...
]
```