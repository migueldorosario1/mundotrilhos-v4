# Prompt para o ZM61: banner Mundo Trilhos no espaço do Moka Reader

Implemente no Cafezinho a alternância do banner Mundo Trilhos com o Moka Reader, no mesmo espaço atual. Não crie uma nova faixa nem substitua permanentemente o anúncio do Moka.

## Arquivos entregues
Repositório: migueldorosario1/mundotrilhos-v4
Branch: manifesto-e-trem-lula-20261112
Pasta: docs/manifestos/banner-mundo-trilhos/
- mundo-trilhos-728x90.html: desktop, 728 × 90 px, 2.621 bytes.
- mundo-trilhos-300x250.html: mobile, 300 × 250 px, 2.829 bytes.

São peças autocontidas em HTML/CSS/SVG, sem bibliotecas, fontes externas, rastreadores ou imagens pesadas. Preservam o verde-petróleo, dourado e trem ilustrado do banner aprovado, com duas mensagens e virada suave de oito segundos. O link é https://www.mundotrilhos.com/. Há alternativa sem movimento via prefers-reduced-motion.

## Estado observado no site, não presuma que continua igual
Na homepage https://www.ocafezinho.com/, o contêiner #moka-banner-home aparece antes do rodapé.
Desktop usa /wp-content/banners-cafezinho/rotator-728x90.html?v=2, iframe 728×90.
Mobile usa /wp-content/banners-cafezinho/rotator-300x250.html?v=2, iframe 300×250.
Esses rotators apontam para /wp-content/moka-banners/moka-728x90-pt.html e moka-300x250-pt.html.
Existe código antigo de MOKA x KUBET, mas P_KUBET está em ZERO. Não reative Kubet, não o inclua no novo sorteio e não altere anúncios de terceiros.

## Implementação
1. Releia a versão atual dos arquivos e o procedimento operacional vigente. Preserve cópias para rollback. Identifique se os mesmos rotators são usados em outras páginas; restrinja a mudança ao espaço autorizado ou informe antes de ampliar seu alcance.
2. Copie as duas peças para um diretório de assets do Cafezinho, com MIME text/html. GitHub é a entrega, não use página blob ou raw como iframe de produção.
3. Reaproveite o mecanismo existente: sorteio 50/50 por carregamento entre Moka Reader e Mundo Trilhos, imune ao cache da página. Preserve o fallback sem JavaScript do Moka. Não faça alternância automática de anúncios enquanto alguém lê; a animação interna do Mundo Trilhos é independente.
4. Mantenha dimensões, posição, breakpoint desktop/mobile e lazy loading existentes. Não duplique espaços nem crie salto de layout. Não estique o antigo GIF de 970×250.
5. Valide em navegador real antes de publicar: ambos os textos durante o ciclo completo, ausência de sobreposição/corte, legibilidade, clique correto, teclado, reduced-motion, mobile e desktop. Caso necessário, ajuste somente tipografia/posicionamento para caber nas dimensões exatas.
6. Preserve o link original do Moka. O Mundo Trilhos abre https://www.mundotrilhos.com/ em nova aba com noopener noreferrer.
7. Faça a implantação conforme o fluxo autorizado e a limpeza pontual de cache necessária. Teste carregamentos repetidos para confirmar os dois destinos, sem exigir proporção exata em amostra pequena.
8. Entregue URLs públicas dos assets, arquivos alterados, capturas desktop/mobile, peso final e instrução de rollback.

## Limites desta entrega
As dimensões e o mecanismo atual foram conferidos diretamente nos HTMLs públicos. Os novos arquivos foram conferidos como código, mas o Chromium do ambiente não conseguiu iniciar por restrição de socket; a conferência visual em navegador real ainda deve ser feita pelo ZM61 antes da implantação. Nenhuma alteração foi feita no Cafezinho nesta entrega.
