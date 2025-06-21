const fs = require('fs')
const path = require('path')

const from = path.join(__dirname, 'script_js', 'service_worker.js')
const to = path.join(__dirname, 'service_worker.js')

fs.rename(from,to, (err) => {
    if (err) {
        console.error('Erro ao mover o service_worker.js:', err)
        process.exit(1)
    }else{ 
        console.log('service_worker.js movido com sucesso!')
    }
})