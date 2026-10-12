function Card({ name, src, onClick }) {

    return (
        <div className='cardLayout' onClick={onClick}>
            <img src={src} alt={name} />
            <label>{name}</label>
        </div>
    )
}

export default Card