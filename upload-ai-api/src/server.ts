import { fastify } from   'fastify'
import { fastifyCors} from '@fastify/cors'
import { getAllPropmpsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAiCompletionRoute } from './routes/generate-ai-completion'

const app = fastify()

app.register(fastifyCors, {
  origin: '*' // colocar a url do site em produção
})

app.register(getAllPropmpsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)

app.listen({
  port:3333,
}).then(() => {
  console.log('HHTP Server Running')
})