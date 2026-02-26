import React, { useState, useEffect } from "react";

export default function PredictaIA() {
  const [maquina, setMaquina] = useState("");
  const [area, setArea] = useState("");
  const [descricao, setDescricao] = useState("");
  const [historico, setHistorico] = useState([]);
  const [audio] = useState(
    new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg")
  );

  // Carregar histórico ao abrir
  useEffect(() => {
    const salvo = localStorage.getItem("historicoPredicta");
    if (salvo) {
      setHistorico(JSON.parse(salvo));
    }
  }, []);

  // Salvar histórico sempre que atualizar
  useEffect(() => {
    localStorage.setItem("historicoPredicta", JSON.stringify(historico));
  }, [historico]);

  const analisarProblema = () => {
    if (!maquina || !area || !descricao) {
      alert("Preencha todos os campos!");
      return;
    }

    const texto = descricao.toLowerCase();
    let score = 0;

    if (texto.includes("vazamento")) score += 30;
    if (texto.includes("barulho")) score += 20;
    if (texto.includes("superaquecimento")) score += 40;
    if (texto.includes("falha")) score += 35;
    if (texto.includes("quebra")) score += 50;

    let nivel = "BAIXO";
    let cor = "green";

    if (score >= 70) {
      nivel = "CRÍTICO";
      cor = "red";
      audio.play();
    } else if (score >= 40) {
      nivel = "MÉDIO";
      cor = "orange";
    }

    const novoRegistro = {
      maquina,
      area,
      descricao,
      score,
      nivel,
      cor,
      data: new Date().toLocaleString(),
    };

    setHistorico([novoRegistro, ...historico]);
    setMaquina("");
    setArea("");
    setDescricao("");
  };

  const silenciar = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  const enviarWhatsApp = (item) => {
    const numero = "5531998297433";

    const mensagem = `
🚨 ALERTA PREDICTA IA 🚨

Máquina: ${item.maquina}
Área: ${item.area}
Problema: ${item.descricao}

Nível: ${item.nivel}
Score: ${item.score}
Data: ${item.data}
    `;

    const mensagemFormatada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${numero}?text=${mensagemFormatada}`, "_blank");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "40px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "36px" }}>🔧 PREDICTA IA</h1>
      <p style={{ textAlign: "center", marginBottom: "40px", opacity: 0.7 }}>
        Sistema Inteligente de Análise de Manutenção
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "600px",
          margin: "0 auto 40px",
        }}
      >
        <input
          placeholder="Máquina"
          value={maquina}
          onChange={(e) => setMaquina(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Área"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Descreva o problema"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ ...inputStyle, height: "100px" }}
        />

        <button
          onClick={analisarProblema}
          style={{
            width: "100%",
            padding: "12px",
            background: "#00c6ff",
            border: "none",
            borderRadius: "8px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Analisar Problema
        </button>

        <button
          onClick={silenciar}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: "gray",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Silenciar Alarme 🔕
        </button>
      </div>

      <h2 style={{ textAlign: "center" }}>📜 Histórico</h2>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {historico.map((item, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "12px",
              borderLeft: `6px solid ${item.cor}`,
            }}
          >
            <strong>{item.maquina}</strong> - {item.area}
            <p>{item.descricao}</p>
            <p style={{ color: item.cor }}>
              {item.nivel} | Score: {item.score}
            </p>
            <small>{item.data}</small>
            {item.nivel === "CRÍTICO" && (
              <button
                onClick={() => enviarWhatsApp(item)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Enviar WhatsApp 🚀
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
};
