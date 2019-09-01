package org.gluu.casa.plugins.inwebo;

enum CodeType {
    VALID_IMMEDIATELY_FOR_15_MINS(0),
    CODE_INATIVE_VALID_FOR_3_WEEEKS(1),
    ACTIVATION_LINK_VALID_FOR_3_WEEKS(2);

    private long codeType;

    private CodeType(final int codeType) {
        this.codeType = codeType;
    }

    public long getCodeType() {
        return codeType;
    }
}