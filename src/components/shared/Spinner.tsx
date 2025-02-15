interface SpinnerProps {
    width?: number;
    height?: number;
}

const Spinner = ({ width = 24, height = 24 }: SpinnerProps) => {
    return (
        <div className="flex-center w-full">
            <img
                src="assets/icons/spinner.svg"
                alt="spinner"
                width={width}
                height={height}
            />
        </div>
    )
}

export default Spinner;

