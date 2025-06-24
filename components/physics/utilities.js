export default {
    round: function(n) {
        return Math.round(n * 100000000) / 100000000;
    },
    rectanglesColliding: function(r1, r2) {
        if(this.round(r1.x + r1.w) < this.round(r2.x)) return false;
        if(this.round(r1.x) > this.round(r2.x + r2.w)) return false;
        if(this.round(r1.y + r1.h) < this.round(r2.y) && this.round(r1.y)) return false;
        if(this.round(r1.y) > this.round(r2.y + r2.h)) return false;
        return true;
    }
}