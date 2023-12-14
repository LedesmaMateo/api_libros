const express = require('express');
const librosRouter = express.Router();
const libros = require('../data');
const Joi = require('joi');

const librosSchema = Joi.object({
    titulo: Joi.string().required().label("Título"),
    autor: Joi.string().required().label("Autor")
})

librosRouter.get("/", (req, res, next) => {
    try {
        res.json(libros);
    } catch (err) {
        next(err);
    }
})

librosRouter.get("/:id", (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const libro = libros.find((lib) => lib.id === id);

        if (!libro) {
            const error = new Error(`El libro con la id: ${id} no fue encontrado...`);
            error.status = 404;
            throw error;
        }

        res.status(200).json(libro);
    } catch (err) {
        next(err);
    }
})

librosRouter.post("/", (req, res, next) => {
    try {
        const { error, value } = librosSchema.validate(req.body);

        if (error) {
            const validationError = new Error("Error de validación");
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }

        const { titulo, autor } = value;

        const nuevoLibro = {
            id: libros.length + 1,
            titulo,
            autor
        }

        libros.push(nuevoLibro);
        res.status(201).json(nuevoLibro);

    } catch (err) {
        next(err);
    }

});

librosRouter.put("/:id", (req, res, next) => {
    try{
        const id = parseInt(req.params.id);
        const { error, value } = librosSchema.validate(req.body);

        if(error){
            const validationError = new Error("Error de validacion");
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }

        const { titulo, autor } = value;

        const libro = libros.find((lib) => lib.id === id);

        if(!libro){
            const error = new Error(`No se encontro el libro con la id : ${id}`);
            error.status = 400;
            throw error;
        }

        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        res.json(libro);

    } catch (err){
        next(err);
    }
});

librosRouter.delete("/:id", (req, res, next) =>{
    try{
        const id = parseInt(req.params.id);

        const index = libros.findIndex((lib) => lib.id === id);

        if(index === -1){
            const error = new Error(`Libro con la id : ${id} no encontrado.`);
            error.status = 400;
            throw error;
        }

        const libroBorrado = libros.splice(index, 1);
        res.json(libroBorrado);

    } catch (err){
        next(err);
    }
})

module.exports = librosRouter;