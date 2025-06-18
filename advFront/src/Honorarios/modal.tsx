import './modal.css';

interface ModalConfirmacaoProps {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacao({ mensagem, onConfirmar, onCancelar }: ModalConfirmacaoProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className='mensagem'>{mensagem}</p>
        <div className="modal-botoes">
          <button className="btn-confirmar-modal" onClick={onConfirmar}>Sim, excluir</button>
          <button className="btn-cancelar-modal" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
