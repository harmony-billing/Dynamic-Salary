import { hello } from "../index"
import { expect } from "chai"
import "mocha"

describe ("Hello function", () => {
    it('should return hello world', () => {
        let result = hello()
        expect(result).to.equal('Hello World')
    })
})