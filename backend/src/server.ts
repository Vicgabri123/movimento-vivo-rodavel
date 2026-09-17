import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint de verificação de saúde da API
app.get('/api/healthz', (req, res) => {
  res.json({ status: 'ok', service: 'MoveLinda API' });
});

// Exemplo de rota de aulas protegida por papel
app.get('/api/classes', (req, res) => {
  // Aqui você buscaria as aulas no banco PostgreSQL
  res.json([
    { id: '1', title: 'Ginástica e Mobilidade', instructor: 'Prof. Carlos', slots: 10 }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor MoveLinda rodando na porta ${PORT}`);
});
