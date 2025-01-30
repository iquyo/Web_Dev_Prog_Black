// Tests adapted from https://www.sammeechward.com/testing-an-express-app-with-supertest-and-jest

const request = require('supertest');
const app = require('./app');

describe("POST /artists", () => {

    describe("When we pass all the valid inputs", () => {

        test("we should receive status code 201", async () => {
            const response = await request(app).post("/artists").send({ 
                name: "name",
                song: "song",
                networth: 20,
                genre: "genre",
                description: "description" 
            })
            expect(response.statusCode).toBe(201)
        })

        test("content type should be json", async () => {
            const response = await request(app).post("/artists").send({ 
                name: "name",
                song: "song",
                networth: 20,
                genre: "genre",
                description: "description" 
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
        
        test("we should receive a success message", async () => {
            const response = await request(app).post("/artists").send({ 
                name: "name",
                song: "song",
                networth: 20,
                genre: "genre",
                description: "description"  
            })
            expect(response.body.message).toBeDefined()
        })

    })
  
    describe("when we have missing/invalid inputs (testing for multiple combinations of missing/invalid inputs)", () => {
        const invalidData = [
            {name: "name",
            song: "song",
            networth: 20,
            genre: "genre"},

            {song: "song",
            networth: 20,
            genre: "genre",
            description: "description"},

            {song: "song",
            networth: "twenty nine",
            genre: "genre",
            description: "description"}
        ]
        for (const inputSet of invalidData) {
            test("content type should be json", async () => {
                const response = await request(app).post("/artists").send(inputSet)
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            test("we should receive an error message", async () => {
                const response = await request(app).post("/artists").send(inputSet)
                expect(response.body.message).toBeDefined()
            })
            test("we should receive status code 400", async () => {
                const response = await request(app).post("/artists").send(inputSet)
                expect(response.statusCode).toBe(400)
            })
        }
    })

    describe("When we pass nothing", () => {

        test("we should receive status code 400", async () => {
            const response = await request(app).post("/artists").send()
            expect(response.statusCode).toBe(400)
        })

        test("content type should be json", async () => {
            const response = await request(app).post("/artists").send()
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
        
        test("we should receive an error message", async () => {
            const response = await request(app).post("/artists").send()
            expect(response.body.message).toBeDefined()
        })

    })
  })

describe("POST /comments", () => {

    describe("When we pass all the valid inputs", () => {

        test("we should receive status code 201", async () => {
            const response = await request(app).post("/comments").send({ 
                for: "for",
                author: "author",
                content: "content"
            })
            expect(response.statusCode).toBe(201)
        })

        test("content type should be json", async () => {
            const response = await request(app).post("/comments").send({ 
                for: "for",
                author: "author",
                content: "content" 
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
        
        test("we should receive a success message", async () => {
            const response = await request(app).post("/comments").send({ 
                for: "for",
                author: "author",
                content: "content"
            })
            expect(response.body.message).toBeDefined()
        })

    })
  
    describe("when we have missing/invalid inputs (testing for multiple combinations of missing/invalid inputs)", () => {
        const invalidData = [
            {author: "author",
            content: "content"},

            {for: "for"},

            {content: "content"}
        ]
        for (const inputSet of invalidData) {
            test("content type should be json", async () => {
                const response = await request(app).post("/comments").send(inputSet)
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            test("we should receive an error message", async () => {
                const response = await request(app).post("/comments").send(inputSet)
                expect(response.body.message).toBeDefined()
            })
            test("we should receive status code 400", async () => {
                const response = await request(app).post("/comments").send(inputSet)
                expect(response.statusCode).toBe(400)
            })
        }
    })


    describe("When we pass nothing", () => {

        test("we should receive status code 400", async () => {
            const response = await request(app).post("/comments").send()
            expect(response.statusCode).toBe(400)
        })

        test("content type should be json", async () => {
            const response = await request(app).post("/comments").send()
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })
        
        test("we should receive an error message", async () => {
            const response = await request(app).post("/comments").send()
            expect(response.body.message).toBeDefined()
        })

    })
})


describe("GET /artists", () => {

    describe("When we GET all artists", () => {

        test("we should receive status code 200", async () => {
            const response = await request(app).get("/artists").send()
            expect(response.statusCode).toBe(200)
        })

        test("content type should be json", async () => {
            const response = await request(app).get("/artists").send()
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })

        test("we should receive our data", async () => {
            const response = await request(app).get("/artists").send()
            expect(response.body[0]).toBeDefined()
        })
    })
  })


describe("GET /comments", () => {

    describe("When we GET all comments", () => {

        test("we should receive status code 200", async () => {
            const response = await request(app).get("/comments").send()
            expect(response.statusCode).toBe(200)
        })

        test("content type should be json", async () => {
            const response = await request(app).get("/comments").send()
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })

        test("we should receive our data", async () => {
            const response = await request(app).get("/comments").send()
            expect(response.body[0]).toBeDefined()
        })
    })
  })


describe("GET /artists/:id", () => {

    describe("When we GET an artist by their id and pass a valid input (testing for multiple valid inputs)", () => {
        const validData = [
            "/artists/0",
            "/artists/1",
            "/artists/2"
        ]

        for (const inputSet of validData) {
            test("we should receive status code 200", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.statusCode).toBe(200)
            })

            test("content type should be json", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            
            test("we should receive our data", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.body.name).toBeDefined()
            })
        }
    })
  
    describe("when we have invalid inputs (testing for multiple invalid inputs)", () => {
        const invalidData = [
            "/artists/ggff",
            "/artists/1924723746235",
            "/artists/gm28357t7"
        ]
        for (const inputSet of invalidData) {
            test("content type should be json", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            test("we should receive an error message", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.body).toBeDefined()
            })
            test("we should receive status code 400", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.statusCode).toBe(400)
            })
        }
    })
})

describe("GET /comments/:id", () => {

    describe("When we GET a comment by their id and pass a valid input (testing for multiple valid inputs)", () => {
        const validData = [
            "/comments/0",
            "/comments/1",
            "/comments/2"
        ]

        for (const inputSet of validData) {
            test("we should receive status code 200", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.statusCode).toBe(200)
            })

            test("content type should be json", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            
            test("we should receive our data", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.body.author).toBeDefined()
            })
        }
    })
  
    describe("when we have invalid inputs (testing for multiple invalid inputs)", () => {
        const invalidData = [
            "/comments/ggff",
            "/comments/1924723746235",
            "/comments/gm28357t7"
        ]
        for (const inputSet of invalidData) {
            test("content type should be json", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            test("we should receive an error message", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.body).toBeDefined()
            })
            test("we should receive status code 400", async () => {
                const response = await request(app).get(inputSet).send()
                expect(response.statusCode).toBe(400)
            })
        }
    })
})