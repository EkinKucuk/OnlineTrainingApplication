
function ErrorMessage(props) {
    return (
        <div>
            <p>{props.errorMsg}</p>
            <Footer></Footer>
        </div>
    );
}  

export default ErrorMessage;