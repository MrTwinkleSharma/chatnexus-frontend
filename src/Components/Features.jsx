import { AiTwotoneNotification } from "react-icons/ai"
import { MdGroups } from "react-icons/md"
import { FaPeopleArrows } from "react-icons/fa"


export default function Features() {
    return <div>
        <div className="grid grid-cols-3 space-x-16">
            <div>
                <FaPeopleArrows className="text-[#11256D]" size={100} />
                <p className="mt-12 text-wrap text-lg text-justify">
                    Introducing our new app, the ultimate tool for seamless communication and conversation between friends and loved ones. Connect with anyone, anytime, and anywhere with just a few taps. Chat, message, and exchange thoughts and ideas with ease. Download now and experience the power of true connection.
                </p>
            </div> 
            <div>
                <MdGroups className="text-[#11256D]"  size={100} />
                <p className="mt-12 text-wrap text-lg text-justify">
                    The perfect platform to gather people together. Create your own room and invite friends, family, and colleagues to join in on the conversation. Interact, discuss, and connect in a private and secure space. Download now and bring people together like never before
                </p>
            </div>
            <div>
                <AiTwotoneNotification className="text-[#11256D]"  size={100} />
                <p className="mt-12 text-wrap text-lg text-justify">
                    Never miss a conversation again with our new app. With our advanced notification feature, you'll always be informed of new messages and updates in real-time. Stay connected and engaged, even when you're not actively using the app.
                </p>
            </div>
        </div>
    </div>
}
