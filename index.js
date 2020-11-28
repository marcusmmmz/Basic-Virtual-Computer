let debug = false

const isNode = (typeof window === 'undefined')

let instructions = {
    "LOAD": 0b0001,
    "ADD":  0b0010,
    "STORE":0b0011,
    "JUMP": 0b0100,
}

//fetch, decode, execute
let CPU = {
    clock : 500, //CPU Clock (Milliseconds)
    address:0, //Current RAM address
    register:0, //Instruction register
    accumulator:0,

    get instruction() { return this.register >> 4 },
    get argument() { return this.register - (this.instruction << 4) },

    fetch() {
        this.register = RAM.adresses[this.address]
    },
    decode() {
        
    },
    execute() {
        let instruction = this.instruction
        let argument = this.argument
        
        switch (instruction) {
            case instructions["LOAD"]:
                if (debug) console.log(`Loading ${RAM.adresses[argument]} from address ${argument}`)
                this.accumulator = RAM.adresses[argument]
                break;
        
            case instructions["ADD"]:
                if (debug) console.log(`Adding ${this.accumulator} from address ${argument}`)
                this.accumulator += RAM.adresses[argument]
                break;
    
            case instructions["STORE"]:
                if (debug) console.log(`Storing ${this.accumulator} at address ${argument}`)
                RAM.adresses[argument] = this.accumulator
                break;
    
            case instructions["JUMP"]:
                if (debug) console.log(`Jumping to address ${argument}`)
                this.address = argument
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
        if (this.instruction != instructions["JUMP"]) {
            this.address += 1
        }

        updateGUI()

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
    return (instructions[instruction] << 4) + argument
}

function displayInstruction(number) {
    for (const instruction in instructions) {
        if (instructions.hasOwnProperty(instruction)) {
            const element = instructions[instruction];
            if (number == element) {
                return instruction
            }
        }
    }
    return "NULL"
}

let RAM = {
    adresses : new Uint8Array([
        instruction("LOAD", 6),
        instruction("ADD", 7),
        instruction("STORE", 6),
        instruction("JUMP", 1),
        0,
        0,
        1,
        1,
    ]),
}

let tracked = []
function updateGUI() {
    if (!isNode) {
        let output = ""

        for (const instruction in instructions) {
            if (instructions.hasOwnProperty(instruction)) {
                const element = instructions[instruction];
                output += `${instruction} : ${element} <br/>`
            }
        }

        document.getElementById("instructions").innerHTML = output

        output = ""

        RAM.adresses.forEach((value, i, arr) => {
            if (value >> 4) {
                output += `Address ${i}: ${displayInstruction(value >> 4)} ${value - (value >> 4 << 4)} <br/>`
            } else {
                output += `Address ${i}: ${value} <br/>`
            }
        })

        document.getElementById("addresses").innerHTML = output

        output = ""

        let headerValueFormat = (header, value) => {
            return `<div><p>${header}:</p> <p>${value}</p></div>`
        }

        output += headerValueFormat("Clock", CPU.clock )
        output += headerValueFormat("Accumulator", CPU.accumulator)
        output += headerValueFormat("Address", CPU.address)
        output += headerValueFormat("Register", `${displayInstruction(CPU.instruction)} ${CPU.argument}`)

        document.getElementById("cpu").innerHTML = output

        output = ""

        for (const tracker of tracked) {
            output += RAM.adresses[parseInt(tracker)] + "<br/>"
        }

        document.getElementById("tracked").innerHTML = output
    }
}

function addTracker() {
    tracked.push(
        document.getElementById("add-tracker").value
    )
}

updateGUI()