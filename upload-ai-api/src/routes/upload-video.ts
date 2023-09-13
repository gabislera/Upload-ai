import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from '@fastify/multipart'
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from "node:util";

const pump = promisify(pipeline) //transforma a função pipeline que é antiga do node para poder utilizar async await ao inves de callbacks

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    }
  })

  app.post('/videos', async (req, reply) => {
    const data = await req.file()

    if(!data) {
      return reply.status(400).send({ error: 'Missing file input. '})
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3') {
      return reply.status(400).send({ error: 'Invalid input type, please upload a MP3 '})
    }

    
    const fileBaseName = path.basename(data.filename, extension)
    //example.mp3 => example

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName) //caminho onde o arquivo irá ser salvo

    await pump(data.file, fs.createWriteStream(uploadDestination)) //recebe e grava os dados do arquivo aos poucos (stream)

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return {
      video
    }
  })
}