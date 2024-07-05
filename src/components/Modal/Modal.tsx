import { Modal as AntdModal } from 'antd'
import { ModalProps } from 'antd/lib/modal'

function Modal({ ...props }: ModalProps) {
    return (
        <AntdModal
            centered
            closeIcon={
                <svg
                    className='h-full w-full'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                >
                    <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z' />
                </svg>
            }
            okButtonProps={{
                className: 'bg-[#007bff] hover:!bg-[#2997ff]'
            }}
            cancelButtonProps={{
                className: 'border-[#d9d9d9] hover:!text-[#2997ff] hover:!border-[#2997ff]'
            }}
            {...props}
            className={`[&_.ant-modal-close]:right-3 [&_.ant-modal-close]:top-3 [&_.ant-modal-close]:h-[26px] [&_.ant-modal-close]:w-[26px] [&_.ant-modal-close]:hover:bg-transparent sm:[&_.ant-modal-close]:right-[18px] sm:[&_.ant-modal-close]:top-[18px] sm:[&_.ant-modal-close]:h-6 sm:[&_.ant-modal-close]:w-6 [&_.ant-modal-content]:p-2 sm:[&_.ant-modal-content]:p-4 [&_.ant-modal-header]:mb-3 [&_.ant-modal-header]:mt-1 [&_.ant-modal-header]:text-center sm:[&_.ant-modal-header]:mb-4 sm:[&_.ant-modal-header]:mt-0 [&_.ant-modal-title]:text-xl ${
                props.className || ''
            }`}
        >
            <div className='border-t border-solid border-black/20'>{props.children}</div>
        </AntdModal>
    )
}

export default Modal
