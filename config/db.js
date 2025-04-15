import mongoose from 'mongoose';

let cached= global.mongoose

if(!cached){
    cached= global.mongoose= {conn: null, promise: null}
}

