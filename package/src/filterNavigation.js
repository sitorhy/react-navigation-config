export default function (routes = [], allows = [])
{
    if (allows === true)
    {
        return routes;
    }

    function choose(routes, allows, accepts = [])
    {
        for (const i of routes)
        {
            const {name} = i;
            const prop = ["children", "all", "oneOf"].find(j => !!i[j]);
            if (prop && Array.isArray(i[prop]) && i[prop].length)
            {
                const arr = choose(i[prop], allows, []);
                if (arr.length)
                {
                    accepts.push(
                        {
                            ...i,
                            [prop]: arr,
                        }
                    );
                }
            }
            else
            {
                if (name && allows.includes(name))
                {
                    accepts.push(i);
                }
            }
        }
        return accepts;
    }

    return choose(routes, allows);
}
