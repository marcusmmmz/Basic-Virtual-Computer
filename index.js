let debug = false

const isNode = (typeof window === 'undefined')

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

let instructions = {
    "LOAD": 0b0000,
    "ADD":  0b0001,
    "STORE":0b0010,
    "JUMP": 0b0011,
}

//fetch, decode, execute
let CPU = {
    clock : 1000, //CPU Clock (Milliseconds)
    counter:0, //Current RAM address
    register:{}, //Instruction register
    accumulator:null,

    fetch() {
        this.register = RAM.adresses[this.counter]
    },
    decode() {

    },
    execute() {

        switch (this.register.instruction) {
            case instructions["LOAD"]:
                if (debug) console.log(`Loading ${RAM.adresses[this.register.argument]} from address ${this.register.argument}`)
                this.accumulator = RAM.adresses[this.register.argument]
                break;
        
            case instructions["ADD"]:
                if (debug) console.log(`Adding ${this.accumulator} from address ${this.register.argument}`)
                this.accumulator += RAM.adresses[this.register.argument]
                break;
    
            case instructions["STORE"]:
                if (debug) console.log(`Storing ${this.accumulator} at address ${this.register.argument}`)
                RAM.adresses[this.register.argument] = this.accumulator
                break;
    
            case instructions["JUMP"]:
                if (debug) console.log(`Jumping to address ${this.register.argument}`)
                this.counter = this.register.argument
                break;

            default:
                console.log("execute default?")
                break;
        }

        
    },
    cycle() {
        this.fetch()
        this.decode()
        this.execute()
        if (this.register.instruction != instructions["JUMP"]) {
            this.counter += 1
        }

        if (!isNode) {
            let output = ""
            RAM.adresses.forEach((value, i, arr) => {
                if (value.instruction != undefined) {
                    output += `Address ${i}: ${encodeInstruction(value.instruction)} ${value.argument} <br/>`
                } else {
                    output += `Address ${i}: ${value.toString()} <br/>`
                }
            })

            document.getElementById("addresses").innerHTML = output

            output = ""

            output += `clock: ${this.clock} <br/>`
            output += `counter: ${this.counter} <br/>`
            output += `register: ${encodeInstruction(this.register.instruction)} ${this.register.argument} <br/>`
            output += `accumulator: ${this.accumulator} <br/>`

            document.getElementById("cpu").innerHTML = output
        }

    },

    interval:undefined,
    start() {
        this.interval = setInterval( () => {
            this.cycle()
        }, this.clock)
    },
    stop() {
        clearInterval(this.interval)
    },
}

function instruction(instruction, argument) {
    return {
        instruction:instructions[instruction],
        argument
    }
}

function encodeInstruction(number) {
    for (const instruction in instructions) {
        if (instructions.hasOwnProperty(instruction)) {
            const element = instructions[instruction];
            if (number == element) {
                return instruction
            }
        }
    }
}

let RAM = {
    adresses : [
        instruction("LOAD", 6),
        instruction("ADD", 7),
        instruction("STORE", 6),
        instruction("JUMP", 1),
        0,
        0,
        1,
        1,
    ],
}

CPU.start()