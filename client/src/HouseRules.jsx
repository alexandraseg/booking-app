export default function HouseRules({selected, onChange}){

    function handleCbClick(ev){
        const {checked,name} = ev.target;
        if (checked) {
            onChange([...selected,name]);
        }else{
            onChange([...selected.filter(selectedName => selectedName !== name)]);
        }
        // console.log(ev.target.name);
        // console.log(ev.target.checked);

        // onChange([...selected, name]);
    }

    return(
        <div>
            <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                <input type="checkbox" checked={selected.includes('smoking')} name='smoking' onChange={handleCbClick} />
                <span>No smoking allowed</span>
            </label>
            <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                <input type="checkbox" checked={selected.includes('pets')} name='pets' onChange={handleCbClick} />
                <span>No pets allowed</span>
            </label>
            <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                <input type="checkbox" checked={selected.includes('events')} name='events' onChange={handleCbClick} />
                <span>No events allowed</span>
            </label>
        </div>
    );
}