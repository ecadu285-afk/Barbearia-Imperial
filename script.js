
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP = '5582988835803'; // Número existente no site original.

  // Menu mobile acessível.
  const botaoMenu = document.querySelector('.menu-mobile');
  const menu = document.querySelector('#menu-principal');

  const fecharMenu = () => {
    if (!menu || !botaoMenu) return;
    menu.classList.remove('menu-aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
  };

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', () => {
      const aberto = menu.classList.toggle('menu-aberto');
      botaoMenu.setAttribute('aria-expanded', String(aberto));
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    menu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', fecharMenu)
    );

    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !botaoMenu.contains(event.target)) {
        fecharMenu();
      }
    });
  }

  // Animações de entrada ao rolar a página.
  const reduzirMovimento = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!reduzirMovimento && 'IntersectionObserver' in window) {
    const elementos = document.querySelectorAll('.reveal');

    const observador = new IntersectionObserver(entradas => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    elementos.forEach(elemento => observador.observe(elemento));
    document.documentElement.classList.add('js-animacoes');
  }

  // Selecionar serviço diretamente pelo cartão.
  const seletorServico = document.querySelector('#servicoCliente');

  document.querySelectorAll('[data-servico]').forEach(link => {
    link.addEventListener('click', () => {
      if (seletorServico) {
        seletorServico.value = link.dataset.servico;
      }
    });
  });

  // Impedir agendamento em datas anteriores à atual.
  const campoData = document.querySelector('#dataCliente');
  const dataLocal = new Date();

  const dataMinima = [
    dataLocal.getFullYear(),
    String(dataLocal.getMonth() + 1).padStart(2, '0'),
    String(dataLocal.getDate()).padStart(2, '0')
  ].join('-');

  if (campoData) {
    campoData.min = dataMinima;
  }

  // Envio do agendamento pelo WhatsApp.
  const formulario = document.querySelector('#formAgendamento');

  if (formulario) {
    formulario.addEventListener('submit', evento => {
      evento.preventDefault();

      if (!formulario.reportValidity()) return;

      const nome = document.querySelector('#nomeCliente').value.trim();
      const servico = seletorServico.value;
      const data = campoData.value;
      const horario = document.querySelector('#horaCliente').value;

      if (!nome || !servico || !data || !horario) return;

      if (data < dataMinima) {
        campoData.setCustomValidity(
          'Escolha a data de hoje ou uma data futura.'
        );
        campoData.reportValidity();
        return;
      }

      campoData.setCustomValidity('');

      const [ano, mes, dia] = data.split('-');

      const mensagem =
        `Olá! Gostaria de solicitar um agendamento na Barbearia Imperial.\n\n` +
        `Nome: ${nome}\n` +
        `Serviço: ${servico}\n` +
        `Data desejada: ${dia}/${mes}/${ano}\n` +
        `Horário desejado: ${horario}\n\n` +
        `Podem confirmar a disponibilidade?`;

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

      window.location.href = url;
    });

    campoData?.addEventListener('input', () => {
      campoData.setCustomValidity('');
    });
  }

  // Galeria de fotos ampliadas.
  const lightbox = document.querySelector('#lightbox');
  const imagemAmpliada = document.querySelector('#lightbox-imagem');
  const legenda = document.querySelector('#lightbox-legenda');
  const fechar = document.querySelector('.lightbox-fechar');

  let ultimoFoco = null;

  const fecharLightbox = () => {
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sem-scroll');
    imagemAmpliada.removeAttribute('src');

    ultimoFoco?.focus();
  };

  document.querySelectorAll('.foto-botao').forEach(botao => {
    botao.addEventListener('click', () => {
      if (!lightbox || !imagemAmpliada) return;

      ultimoFoco = botao;

      imagemAmpliada.src = botao.dataset.imagem;
      imagemAmpliada.alt =
        botao.dataset.legenda || 'Fotografia ampliada';

      if (legenda) {
        legenda.textContent = botao.dataset.legenda || '';
      }

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('sem-scroll');

      fechar?.focus();
    });
  });

  fechar?.addEventListener('click', fecharLightbox);

  lightbox?.addEventListener('click', evento => {
    if (evento.target === lightbox) {
      fecharLightbox();
    }
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
      fecharLightbox();
      fecharMenu();
    }

    if (evento.key === 'Tab' && lightbox && !lightbox.hidden) {
      evento.preventDefault();
      fechar?.focus();
    }
  });

  // Atualizar automaticamente o ano do rodapé.
  const ano = document.querySelector('#ano-atual');

  if (ano) {
    ano.textContent = String(new Date().getFullYear());
  }
});
