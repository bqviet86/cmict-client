import Panel from '~/components/Panel'
import { BACKGROUND_COLOR_TOPS, REASON_CHOOSE_ICT } from '~/constants/interfaceData'

type ReasonChooseICTPanelProps = {
    className?: string
}

function ReasonChooseICTPanel({ className }: ReasonChooseICTPanelProps) {
    return (
        <Panel title='Tại sao bạn nên chọn ICT ?' size='small' color='#ff6a61' className={className}>
            {REASON_CHOOSE_ICT.map(({ title, desc }, index) => (
                <div key={index} className='[&+&]:mt-2'>
                    <div className='flex items-center gap-2'>
                        <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${
                                index < 3 ? BACKGROUND_COLOR_TOPS[index + 1] : 'bg-[#777777]'
                            }`}
                        >
                            {index + 1}
                        </span>
                        <span className='font-medium text-[#337ab7]'>{title}</span>
                    </div>

                    <p className='mt-2 text-[15px]'>
                        <span className='font-medium text-[#e74c3c]'>CMICT</span> - {desc}
                    </p>
                </div>
            ))}
        </Panel>
    )
}

export default ReasonChooseICTPanel
