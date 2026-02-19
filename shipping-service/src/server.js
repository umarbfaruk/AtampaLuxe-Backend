import app from './app.js';

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Shipping Service running on port ${PORT}`));
