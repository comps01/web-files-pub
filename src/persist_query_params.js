(function() {
    const rawQueryString = window.location.search; // Get current query parameters
    const allowedParams = ['gclid', 'msclkid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']; // Define allowed parameters

    // Function to filter query parameters based on allowed list
    function filterQueryParams(queryString, allowedParams) {
        const params = new URLSearchParams(queryString);
        const filteredParams = new URLSearchParams();
        for (const [key, value] of params) {
            if (allowedParams.includes(key)) {
                filteredParams.append(key, value);
            }
        }
        const filteredString = filteredParams.toString();
        return filteredString ? '?' + filteredString : '';
    }

    // Apply query filtering if needed
    const queryString = filterQueryParams(rawQueryString, allowedParams);

    // Function to extract and temporarily remove the fragment from a URL
    function extractFragment(url) {
        const hashIndex = url.indexOf('#');
        if (hashIndex === -1) {
            return { url, fragment: '' };
        }
        return {
            url: url.substring(0, hashIndex),
            fragment: url.substring(hashIndex)
        };
    }

    // Function to append query parameters to a URL
    function appendQueryParamsToUrl(url, queryString, extras) {
        let finalUrl = url;

        if (queryString) {
            const queryStringWithoutQM = queryString.slice(1); // Remove the '?' character
            if (url.indexOf('?') !== -1) {
                if (!url.includes(queryStringWithoutQM)) { // Prevent duplicate query params
                    finalUrl += '&' + queryStringWithoutQM;
                }
            } else {
                finalUrl += queryString;
            }
        }

        if (extras) {
            finalUrl += (finalUrl.indexOf('?') !== -1 ? '&' : '?') + extras;
        }

        return finalUrl;
    }

    // Throttle variable to prevent multiple fast clicks
    let isThrottled = false;
    const isSignUpLink = rawQueryString.includes('page=signup');

    // Add click event listener with event delegation
    document.body.addEventListener('click', function(event) {
        const link = event.target.closest('a');

        if (!link || !link.href || link.className.includes('pagination')) return; // Exit if not a link or href is missing

        if ((link.hostname === window.location.hostname || link.hostname === 'appv2.comparables.ai') && !isThrottled) {
            event.preventDefault(); // Prevent default navigation
            isThrottled = true; // Throttle clicks

            // Check if link.href is just '#' and update the href dynamically
            const linkHref = link.getAttribute('href');
            if (linkHref === '#') {
                link.href = 'https://appv2.comparables.ai/login';
            }

            // Determine extras based on the clicked element's ID
            let extras = '';
            const elementId = event.target.id;

            if (elementId === 'tryItNow' || isSignUpLink) {
                extras = 'page=signup';
            } else if (elementId === 'google') {
                extras = 'socialSignupType=google';
            } else if (elementId === 'linkedin') {
                extras = 'socialSignupType=linkedin';
            } else if (elementId === 'microsoft') {
                extras = 'socialSignupType=azure-ad';
            }

            // Extract the fragment (if any)
            const { url, fragment } = extractFragment(link.href);

            // Append the query string and extras to the URL
            const updatedUrl = appendQueryParamsToUrl(url, queryString, extras) + fragment;

            // Fire the DataLayer event for sign-up actions before redirecting
            if (extras.includes('page=signup') || updatedUrl.includes('page=signup') || updatedUrl.includes('/signup')) {
                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: 'sign_up',
                        method: 'homepage_bottom'
                    });
                } else {
                    console.error('DataLayer not found.');
                }
            }

            // Redirect to the updated URL
            window.location.href = updatedUrl;

            // Reset the throttle after navigation
            isThrottled = false;
        }
    });
})();