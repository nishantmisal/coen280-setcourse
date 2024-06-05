import DeleteCourseModalCSS from './DeleteCourseModal.module.css';

function DeleteCourseModal({setOpenDeleteModal, onConfirmDelete, itemToDelete}) {
    return (
        <>
            <div className={`${DeleteCourseModalCSS.backdrop} h-100 w-100 position-absolute bg-dark`}></div>
            <div className={`${DeleteCourseModalCSS.wrapper} m-0 p-3 position-absolute top-50 start-50 translate-middle rounded-3 bg-dark d-flex flex-column justify-content-between`}>
                <p className="m-0 p-0 text-white">Are you sure you want to delete <span className="m-0 p-0 text-info fst-italic">{itemToDelete.title}</span> from your schedule?</p>
                <div className="m-0 p-0 d-flex gap-2">
                    <button className={`${DeleteCourseModalCSS.modalButton} rounded border-0`} onClick={() => {setOpenDeleteModal(prevState => !prevState)}}>Cancel</button>
                    <button className={`${DeleteCourseModalCSS.modalButton} rounded border-0 bg-danger text-white`} onClick={() => {onConfirmDelete(itemToDelete.id)}}>Yes, delete</button>
                </div>
            </div>
        </>
    );
  }
  
export default DeleteCourseModal;