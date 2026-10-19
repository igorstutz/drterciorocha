/**
 * Política de privacidade (LGPD) — o texto de /privacidade. Escrita em 14/10/2026 a partir do que o site
 * e o painel de atendimento fazem de verdade: formulários (consulta, botões de WhatsApp, e-book), a ficha
 * para a guia de exames (/guia), o WhatsApp pela plataforma da Meta, o atendimento automático e o apoio
 * de IA à equipe, a atribuição de campanha guardada no navegador por 30 dias e, desde 19/10/2026, o pixel
 * da Meta com a API de Conversões (medição de anúncios; nada de saúde vai para a Meta).
 *
 * Revisão jurídica recomendada antes da publicação definitiva. O que mudar (prazos, canal do encarregado,
 * razão social/CNPJ) muda aqui; a data abaixo acompanha.
 */

import { contact, doctor } from "./site";

export const PRIVACIDADE_ATUALIZADA = "19 de outubro de 2026";

export interface SecaoPrivacidade {
  id: string;
  titulo: string;
  paragrafos: string[];
  lista?: string[];
  /** Texto depois da lista. */
  fecho?: string[];
}

export const SECOES_PRIVACIDADE: SecaoPrivacidade[] = [
  {
    id: "quem-somos",
    titulo: "1. Quem é responsável pelos seus dados",
    paragrafos: [
      `A Clínica Tércio Rocha, de ${doctor.name} (${doctor.crm.join(", ")}), com atendimento em São Paulo, é a controladora dos dados pessoais tratados por este site (drterciorocha.com) e pelo atendimento por WhatsApp no número ${contact.whatsappLabel}.`,
      `Esta política explica quais dados recebemos, por que usamos, com quem compartilhamos, por quanto tempo guardamos e como você exerce os seus direitos previstos na Lei Geral de Proteção de Dados (Lei 13.709/2018).`,
    ],
  },
  {
    id: "dados",
    titulo: "2. Quais dados recebemos",
    paragrafos: ["Só pedimos o que precisamos para responder ao seu contato e organizar o seu atendimento."],
    lista: [
      "Formulários do site (página de consulta, botões de WhatsApp e e-book): nome, e-mail, número de WhatsApp, o que você pretende tratar e a mensagem que escrever, além da página de onde o pedido saiu.",
      "Ficha para a guia de solicitação de exames (/guia), preenchida só por quem decidiu seguir com a consulta: nome completo, CPF, RG, data de nascimento, estado civil, e-mail, telefone, endereço, idade, peso, altura, queixa principal, doenças associadas, tratamentos já realizados e a modalidade da consulta (presencial ou on-line). Parte desses dados é sensível, por dizer respeito à sua saúde.",
      "Conversa pelo WhatsApp: o seu número, o nome do seu perfil, as mensagens trocadas, os arquivos que você enviar (comprovantes, resultados de exames, fotos) e os horários de envio.",
      "Origem da visita: se você chegou por um anúncio ou link de campanha, guardamos no seu navegador, por até 30 dias, os parâmetros dessa campanha (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid e a página de referência), para saber por onde o contato chegou. Esse registro fica só no seu navegador até você enviar um formulário.",
    ],
    fecho: [
      "Medição de anúncios: o site usa o Pixel da Meta e a API de Conversões da Meta para saber quantas visitas e quantos contatos vieram dos nossos anúncios no Facebook e no Instagram. O pixel grava cookies próprios no seu navegador (_fbp e, quando você chega por um anúncio, _fbc). Quando você envia o formulário de consulta, um botão de WhatsApp ou o pedido do e-book, a Meta recebe que houve um contato, junto com o seu e-mail, telefone e nome criptografados (convertidos num código que não permite ler o dado original), o endereço IP e o navegador, para relacionar o contato ao anúncio que você viu.",
      "Nunca enviamos à Meta o que você pretende tratar, a mensagem que escreveu nem nenhum dado da ficha para a guia de exames; a página da ficha nem carrega o pixel. Você pode bloquear esses cookies nas configurações do navegador e ajustar os anúncios que vê nas configurações da sua conta do Facebook ou do Instagram. As fontes e as imagens são servidas pelo próprio site.",
    ],
  },
  {
    id: "finalidades",
    titulo: "3. Para que usamos e com que base legal",
    paragrafos: [],
    lista: [
      "Responder ao seu contato e fazer a triagem inicial do seu caso — com base no seu consentimento, dado na caixa de seleção do formulário ou ao escrever para o nosso WhatsApp, e nos procedimentos preliminares à prestação do serviço.",
      "Emitir a guia de solicitação de exames, organizar o agendamento e realizar a consulta — com base na tutela da saúde, em procedimento realizado por profissional de saúde, e na execução do serviço contratado.",
      "Enviar o material que você pediu, como o e-book de longevidade.",
      "Comunicar novidades da clínica, eventos e conteúdos — somente com o seu consentimento, que pode ser retirado a qualquer momento pelo próprio WhatsApp.",
      "Cumprir obrigações legais e regulatórias, como a guarda de prontuário e documentos fiscais.",
      "Manter a segurança do site e do atendimento e prevenir fraudes.",
    ],
  },
  {
    id: "atendimento-automatico",
    titulo: "4. Atendimento automático e inteligência artificial",
    paragrafos: [
      "As primeiras mensagens no WhatsApp podem ser respondidas por um assistente automático da clínica: um menu de opções e textos padronizados sobre o tratamento, a consulta, os valores e as condições do agendamento. A qualquer momento você pode pedir para falar com uma pessoa da equipe.",
      "A equipe pode usar ferramentas de inteligência artificial para sugerir ou redigir respostas a partir das informações oficiais da clínica. Essas ferramentas nunca fazem diagnóstico, não prometem resultado e não decidem nada sobre o seu tratamento — toda decisão clínica é do médico, na consulta. O provedor dessas ferramentas trata o conteúdo das mensagens apenas para gerar a resposta, sob contrato que proíbe o uso dos seus dados para treinar modelos.",
    ],
  },
  {
    id: "compartilhamento",
    titulo: "5. Com quem compartilhamos",
    paragrafos: ["Não vendemos nem cedemos os seus dados. Compartilhamos apenas com quem é necessário para o atendimento funcionar:"],
    lista: [
      "Meta Platforms (WhatsApp Business Platform), que transporta as mensagens entre você e a clínica — sujeita à política de privacidade do WhatsApp.",
      "Meta Platforms (Pixel e API de Conversões), que mede o resultado dos anúncios, nos limites do item 2 — sem dados de saúde.",
      "Provedores de hospedagem e infraestrutura do site e do sistema de atendimento da clínica, com acesso restrito e contratos de confidencialidade.",
      "Provedor das ferramentas de inteligência artificial descritas acima, nos limites do item 4.",
      "Quando você pede informações sobre cursos e treinamentos, indicamos o contato da consultora responsável; os seus dados só chegam a ela se você mesmo falar com ela.",
      "Autoridades públicas, quando houver obrigação legal ou ordem judicial.",
    ],
    fecho: [
      "Alguns desses provedores podem processar dados fora do Brasil. Nesses casos a transferência segue as garantias previstas na LGPD.",
    ],
  },
  {
    id: "prazos",
    titulo: "6. Por quanto tempo guardamos",
    paragrafos: [],
    lista: [
      "Pedidos de contato que não seguiram para a consulta: por até 24 meses depois da última interação, para podermos retomar o atendimento se você voltar a nos procurar — ou antes, se você pedir a exclusão.",
      "Ficha, exames, conversas e documentos de quem passou pela consulta: pelos prazos da legislação de saúde para a guarda de prontuário (no mínimo 20 anos) e pelos prazos fiscais aplicáveis.",
      "Parâmetros de campanha no seu navegador: 30 dias, ou até você limpar os dados do navegador.",
    ],
  },
  {
    id: "direitos",
    titulo: "7. Os seus direitos",
    paragrafos: ["A LGPD garante a você, a qualquer momento e sem custo:"],
    lista: [
      "confirmar se tratamos os seus dados e acessá-los;",
      "corrigir dados incompletos, inexatos ou desatualizados;",
      "pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei;",
      "pedir a portabilidade dos dados;",
      "saber com quem compartilhamos;",
      "revogar o consentimento e deixar de receber comunicações;",
      "opor-se a tratamentos feitos sem consentimento, quando a lei permitir.",
    ],
    fecho: [
      `Para exercer qualquer desses direitos, escreva para o nosso WhatsApp ${contact.whatsappLabel} dizendo que o assunto é privacidade, ou use o formulário de contato do site. Respondemos em até 15 dias. Pedidos sobre prontuário seguem as regras do Conselho Federal de Medicina.`,
      "Se entender que o seu pedido não foi atendido, você pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).",
    ],
  },
  {
    id: "seguranca",
    titulo: "8. Como protegemos",
    paragrafos: [
      "O site e o sistema de atendimento usam conexão criptografada (HTTPS). O acesso às conversas e aos dados é restrito à equipe da clínica, por login individual e perfil de permissão, com registro de atividade. As credenciais de integração ficam criptografadas, e há cópias de segurança periódicas. Nenhum sistema é infalível: se identificarmos um incidente que possa gerar risco a você, comunicaremos você e a ANPD como a lei determina.",
    ],
  },
  {
    id: "menores",
    titulo: "9. Crianças e adolescentes",
    paragrafos: [
      "Dados de crianças e adolescentes só são tratados quando informados pelos pais ou responsáveis legais, no interesse do paciente e para o seu atendimento. Se você for responsável e quiser revisar ou excluir esses dados, use os canais do item 7.",
    ],
  },
  {
    id: "alteracoes",
    titulo: "10. Alterações desta política",
    paragrafos: [
      `Podemos atualizar esta política para refletir mudanças no atendimento ou na lei. A versão vigente é sempre a publicada nesta página, com a data de atualização no topo. Última atualização: ${PRIVACIDADE_ATUALIZADA}.`,
    ],
  },
];
