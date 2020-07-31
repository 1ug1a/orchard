/**
 * Assorted bits and bobs
 */

import _ from "lodash";
import cm from "classnames";

export function Authors({authors, _class}) {

    // show a single pencil if it's only one author
    function Icon({_class}) {
        return (
            <svg class={_class} viewBox="0 0 512 512">
                <path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/>
            </svg>
        )
    }

    return (
        <div class={cm("flex flex-row items-center", _class)}>
            <Icon _class="w-3 h-3 text-gray-700" />
            <ul class="leading-none">
                {
                    authors.map((author, idx, arr) => {
                        const message = _.cond([
                            [({arr}) => arr.length === 1,             _.constant(author)],
                            [({idx, arr}) => idx === arr.length - 1,  ({author}) => "and " + author],
                            [_.stubTrue,                              ({author}) => author + ","]
                        ]);
                        
                        return (
                            <li class="inline-block ml-1 text-xs text-gray-700" >{message({author, idx, arr})}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}